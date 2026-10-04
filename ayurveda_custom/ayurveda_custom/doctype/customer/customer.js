// Copyright (c) 2026, The Elements Tech and contributors
// For license information, please see license.txt

frappe.ui.form.on("Customer", {
	refresh(frm) {
		if (frm.is_new()) return;

		frm.add_custom_button(__("Work Orders"), () => {
			frappe.set_route("List", "Work Order", { customer: frm.doc.name });
		}, __("View"));
		frm.add_custom_button(__("Work Order"), () => {
			frappe.new_doc("Work Order", { customer: frm.doc.name });
		}, __("Create"));
	},
});
