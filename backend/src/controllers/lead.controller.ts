import { Response } from "express";
import { FilterQuery } from "mongoose";
import Lead, { ILeadDocument } from "../models/Lead";
import { asyncHandler, AppError } from "../middleware/error";
import { AuthRequest } from "../middleware/auth";
import { LeadQueryParams, LeadStatus, LeadSource } from "../types";

export const getLeads = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const {
      page = "1",
      limit = "10",
      status,
      source,
      search,
      sort = "latest",
    }: LeadQueryParams = req.query as LeadQueryParams;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter: FilterQuery<ILeadDocument> = {};

    //sales user can only see their own leads
    if (req.user?.role === "sales") {
      filter.createdBy = req.user.userId;
    }

    if (status) filter.status = status;
    if (source) filter.source = source;

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [{ name: regex }, { email: regex }];
    }

    const sortOrder = sort === "oldest" ? 1 : -1;

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .populate("createdBy", "name email"),
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      message: "Leads retrieved successfully",
      data: { leads },
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
    });
  },
);

export const getLeadById = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const lead = await Lead.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );

    if (!lead) {
      throw new AppError("Lead not found", 404);
    }

    if (
      req.user?.role === "sales" &&
      lead.createdBy._id.toString() !== req.user.userId
    ) {
      throw new AppError("Unauthorized to access this lead", 403);
    }

    res.status(200).json({
      success: true,
      message: "Lead retrieved successfully",
      data: { lead },
    });
  },
);

export const createLead = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { name, email, status, source, notes } = req.body;

    const lead = await Lead.create({
      name,
      email,
      status,
      source,
      notes,
      createdBy: req.user?.userId,
    });

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: { lead },
    });
  },
);

export const updateLead = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      throw new AppError("Lead not found", 404);
    }

    if (
      req.user?.role === "sales" &&
      lead.createdBy.toString() !== req.user.userId
    ) {
      throw new AppError("Unauthorized to update this lead", 403);
    }

    const { name, email, status, source, notes } = req.body;

    if (name !== undefined) lead.name = name;
    if (email !== undefined) lead.email = email;
    if (status !== undefined) lead.status = status;
    if (source !== undefined) lead.source = source;
    if (notes !== undefined) lead.notes = notes;

    await lead.save();

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: { lead },
    });
  },
);

export const deleteLead = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      throw new AppError("Lead not found", 404);
    }

    if (req.user?.role !== "admin") {
      throw new AppError("Unauthorized to delete this lead", 403);
    }

    await lead.deleteOne();
    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  },
);

export const exportLeadsCSV = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const filter: FilterQuery<ILeadDocument> = {};

    if (req.user?.role === "sales") {
      filter.createdBy = req.user.userId;
    }

    const leads = await Lead.find(filter).populate("createdBy", "name");

    const headers = [
      "Name",
      "Email",
      "Status",
      "Source",
      "Notes",
      "Created At",
    ];
    const rows = leads.map((l) => [
      l.name,
      l.email,
      l.status,
      l.source,
      l.notes ?? "",
      new Date(l.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="leads.csv"');
    res.status(200).send(csvContent);
  },
);
