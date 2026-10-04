# Copyright (c) 2026, The Elements Tech and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document
from frappe.model.naming import make_autoname

from ayurveda_custom.ayurveda_custom.doctype.item.item import validate_item_is_enabled


class BOM(Document):
	def autoname(self):
		self.name = make_autoname(f"BOM-{self.item}-.###", doc=self)

	def validate(self):
		validate_item_is_enabled(self.item)

		if self.quantity <= 0:
			frappe.throw(_("Quantity must be greater than 0"))

		self.validate_raw_materials()

	def validate_raw_materials(self):
		for row in self.items:
			row_label = _("Raw Materials Row #{0}").format(row.idx)

			if row.item_code == self.item:
				frappe.throw(_("{0}: Raw material cannot be same as the Finished Good").format(row_label))

			validate_item_is_enabled(row.item_code, row_label)

			if row.qty <= 0:
				frappe.throw(_("{0}: Quantity must be greater than 0").format(row_label))
