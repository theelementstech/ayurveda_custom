// Copyright (c) 2026, The Elements Tech and contributors
// For license information, please see license.txt

frappe.ui.form.on("Item", {
	setup(frm) {
		frm.set_query("uom", () => ({ filters: { enabled: 1 } }));
	},

	refresh(frm) {
		if (frm.is_new()) return;

		frm.add_custom_button(__("BOMs"), () => {
			frappe.set_route("List", "BOM", { item: frm.doc.name });
		}, __("View"));
		frm.add_custom_button(__("Used in BOMs"), () => {
			frappe.set_route("List", "BOM", { "BOM Item.item_code": frm.doc.name });
		}, __("View"));
		frm.add_custom_button(__("Work Orders"), () => {
			frappe.set_route("List", "Work Order", { production_item: frm.doc.name });
		}, __("View"));

		if (!frm.doc.disabled) {
			frm.add_custom_button(__("BOM"), () => {
				frappe.new_doc("BOM", { item: frm.doc.name });
			}, __("Create"));
			if (frm.doc.is_finished_goods) {
				frm.add_custom_button(__("Work Order"), () => {
					frappe.new_doc("Work Order", { production_item: frm.doc.name });
				}, __("Create"));
			}
		}
	},
});
