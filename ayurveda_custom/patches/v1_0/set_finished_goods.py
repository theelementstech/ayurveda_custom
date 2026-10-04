import frappe


def execute():
	# Items that already have a BOM are the finished goods
	for item in frappe.get_all("BOM", pluck="item", distinct=True):
		frappe.db.set_value("Item", item, "is_finished_goods", 1, update_modified=False)
