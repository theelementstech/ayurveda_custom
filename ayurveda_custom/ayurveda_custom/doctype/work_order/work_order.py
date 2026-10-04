# Copyright (c) 2026, The Elements Tech and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document

from ayurveda_custom.ayurveda_custom.doctype.item.item import validate_item_is_enabled


class WorkOrder(Document):
	def validate(self):
		validate_item_is_enabled(self.production_item)
		if not frappe.db.get_value("Item", self.production_item, "is_finished_goods"):
			frappe.throw(_("Item {0} is not a Finished Good").format(frappe.bold(self.production_item)))

		self.validate_bom()

		if self.qty <= 0:
			frappe.throw(_("Quantity to Manufacture must be greater than 0"))

		for row in self.required_items:
			row_label = _("Required Items Row #{0}").format(row.idx)
			validate_item_is_enabled(row.item_code, row_label)

			if row.required_qty <= 0:
				frappe.throw(_("{0}: Required Quantity must be greater than 0").format(row_label))

	def validate_bom(self):
		bom = frappe.db.get_value("BOM", self.bom_no, ["item", "is_active", "docstatus"], as_dict=True)

		if bom.item != self.production_item:
			frappe.throw(
				_("BOM {0} does not belong to Item {1}").format(
					frappe.bold(self.bom_no), frappe.bold(self.production_item)
				)
			)

		if bom.docstatus != 1:
			frappe.throw(_("BOM {0} is not submitted").format(frappe.bold(self.bom_no)))

		if not bom.is_active:
			frappe.throw(_("BOM {0} is not active").format(frappe.bold(self.bom_no)))
