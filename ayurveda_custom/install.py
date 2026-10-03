import frappe

from ayurveda_custom.ayurveda_custom.doctype.item_group.item_group import ROOT_ITEM_GROUP


def after_install():
	create_root_item_group()


def create_root_item_group():
	if frappe.db.exists("Item Group", ROOT_ITEM_GROUP):
		return

	frappe.get_doc(
		{
			"doctype": "Item Group",
			"item_group_name": ROOT_ITEM_GROUP,
			"is_group": 1,
			"parent_item_group": "",
		}
	).insert(ignore_permissions=True)
