import e, { Router } from "express";
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
} from "../controllers/lead.controller";
import { protect, requireRole } from "../middleware/auth";
import {
  createLeadValidator,
  updateLeadValidator,
} from "../validators/lead.validator";
import { handleValidationErrors } from "../middleware/validate";

const router = Router();

router.use(protect);

router.get("/export", exportLeadsCSV);
router.get("/", getLeads);
router.get("/:id", getLeadById);
router.post("/", createLeadValidator, handleValidationErrors, createLead);
router.put("/:id", updateLeadValidator, handleValidationErrors, updateLead);
router.delete("/:id", requireRole("admin"), deleteLead);

export default router;
