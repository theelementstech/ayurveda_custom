# Copyright (c) 2026, The Elements Tech and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document


class Item(Document):
	def validate(self):
		if not frappe.db.get_value("UOM", self.uom, "enabled"):
			frappe.throw(_("UOM {0} is disabled").format(frappe.bold(self.uom)))


def validate_item_is_enabled(item_code, row_label=None):
	"""Throw if the Item is disabled. Used by BOM and Work Order."""
	if frappe.db.get_value("Item", item_code, "disabled"):
		msg = _("Item {0} is disabled").format(frappe.bold(item_code))
		if row_label:
			msg = f"{row_label}: {msg}"
		frappe.throw(msg)
