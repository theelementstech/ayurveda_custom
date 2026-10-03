# Copyright (c) 2026, The Elements Tech and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.utils.nestedset import NestedSet

ROOT_ITEM_GROUP = "All Item Groups"


class ItemGroup(NestedSet):
	nsm_parent_field = "parent_item_group"
	allow_root_deletion = False

	def validate(self):
		if (
			not self.parent_item_group
			and self.item_group_name != ROOT_ITEM_GROUP
			and frappe.db.exists("Item Group", ROOT_ITEM_GROUP)
		):
			self.parent_item_group = ROOT_ITEM_GROUP

		self.validate_parent()

	def validate_parent(self):
		if not self.parent_item_group:
			return

		if self.parent_item_group == self.name:
			frappe.throw(_("Item Group cannot be its own parent"))

		if not frappe.db.get_value("Item Group", self.parent_item_group, "is_group"):
			frappe.throw(
				_("Parent Item Group {0} must be a group. Tick 'Is Group' on it first.").format(
					frappe.bold(self.parent_item_group)
				)
			)

	def on_update(self):
		super().on_update()
		self.validate_one_root()
