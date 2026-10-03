// Copyright (c) 2026, The Elements Tech and contributors
// For license information, please see license.txt

frappe.ui.form.on("Item Group", {
	setup(frm) {
		frm.set_query("parent_item_group", (doc) => ({
			filters: { is_group: 1, name: ["!=", doc.name] },
		}));
	},

	refresh(frm) {
		frm.add_custom_button(__("Item Group Tree"), () => {
			frappe.set_route("Tree", "Item Group");
		}, __("View"));

		if (frm.is_new()) return;

		frm.add_custom_button(__("Items"), () => {
			frappe.set_route("List", "Item", { item_group: frm.doc.name });
		}, __("View"));

		if (frm.doc.is_group) {
			frm.add_custom_button(__("Child Item Group"), () => {
				frappe.new_doc("Item Group", { parent_item_group: frm.doc.name });
			}, __("Create"));
		}

		frm.add_custom_button(__("Item"), () => {
			frappe.new_doc("Item", { item_group: frm.doc.name });
		}, __("Create"));
	},
});
