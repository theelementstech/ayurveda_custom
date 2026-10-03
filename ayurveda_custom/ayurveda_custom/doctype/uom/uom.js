// Copyright (c) 2026, The Elements Tech and contributors
// For license information, please see license.txt

frappe.ui.form.on("UOM", {
	refresh(frm) {
		if (frm.is_new()) return;

		frm.add_custom_button(__("Items"), () => {
			frappe.set_route("List", "Item", { uom: frm.doc.name });
		}, __("View"));

		frm.add_custom_button(frm.doc.enabled ? __("Disable") : __("Enable"), () => {
			frm.set_value("enabled", frm.doc.enabled ? 0 : 1);
			frm.save();
		});
	},
});
