// Copyright (c) 2026, The Elements Tech and contributors
// For license information, please see license.txt

frappe.ui.form.on("BOM", {
	setup(frm) {
		frm.set_query("item", () => ({ filters: { disabled: 0 } }));
		frm.set_query("item_code", "items", (doc) => ({
			filters: { disabled: 0, name: ["!=", doc.item || ""] },
		}));
	},

	onload_post_render(frm) {
		// Native "Add Multiple" button on the Raw Materials grid
		frm.get_field("items").grid.set_multiple_add("item_code", "qty");
	},

	refresh(frm) {
		if (frm.is_new()) return;

		frm.add_custom_button(__("Work Orders"), () => {
			frappe.set_route("List", "Work Order", { bom_no: frm.doc.name });
		}, __("View"));
		frm.add_custom_button(__("Other BOMs of this Item"), () => {
			frappe.set_route("List", "BOM", { item: frm.doc.item });
		}, __("View"));

		if (frm.doc.docstatus === 1 && frm.doc.is_active) {
			frm.add_custom_button(__("Work Order"), () => {
				frappe.new_doc("Work Order", {
					production_item: frm.doc.item,
					bom_no: frm.doc.name,
				});
			}, __("Create"));
		}

		if (frm.doc.docstatus === 2) return;

		frm.add_custom_button(frm.doc.is_active ? __("Deactivate") : __("Activate"), () => {
			frm.set_value("is_active", frm.doc.is_active ? 0 : 1);
			frm.save(frm.doc.docstatus === 1 ? "Update" : "Save");
		});
	},
});

frappe.ui.form.on("BOM Item", {
	item_code(frm, cdt, cdn) {
		// "Add Multiple" sets item_code without running fetch_from, so fetch here
		const row = locals[cdt][cdn];
		if (!row.item_code || row.uom) return;
		frappe.db.get_value("Item", row.item_code, ["item_name", "uom"]).then(({ message }) => {
			frappe.model.set_value(cdt, cdn, message);
		});
	},
});
