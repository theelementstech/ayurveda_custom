// Copyright (c) 2026, The Elements Tech and contributors
// For license information, please see license.txt

frappe.ui.form.on("Work Order", {
	setup(frm) {
		frm.set_query("production_item", () => ({
			filters: { disabled: 0, is_finished_goods: 1 },
		}));
		frm.set_query("bom_no", (doc) => {
			if (!doc.production_item) {
				frappe.throw(__("Please select Item to Manufacture first"));
			}
			return { filters: { item: doc.production_item, is_active: 1, docstatus: 1 } };
		});
		frm.set_query("item_code", "required_items", () => ({ filters: { disabled: 0 } }));
	},

	onload_post_render(frm) {
		// Native "Add Multiple" button on the Required Items grid
		frm.get_field("required_items").grid.set_multiple_add("item_code", "required_qty");
	},

	refresh(frm) {
		if (frm.doc.bom_no && frm.doc.docstatus === 0) {
			frm.add_custom_button(__("Get Items from BOM"), () => get_items_from_bom(frm));
		}

		if (frm.is_new()) return;

		frm.add_custom_button(__("BOM"), () => {
			frappe.set_route("Form", "BOM", frm.doc.bom_no);
		}, __("View"));
		frm.add_custom_button(__("Item"), () => {
			frappe.set_route("Form", "Item", frm.doc.production_item);
		}, __("View"));

		// Status buttons are hidden once a Workflow (e.g. QC check) is active on Work Order
		if (frappe.model.has_workflow(frm.doctype)) return;

		const next_status = {
			Draft: [__("Start"), "In Progress"],
			"In Progress": [__("Send for QC"), "QC Pending"],
			"QC Pending": [__("Complete"), "Completed"],
		}[frm.doc.status];

		if (next_status) {
			frm.add_custom_button(next_status[0], () => {
				frm.set_value("status", next_status[1]);
				frm.save();
			}).addClass("btn-primary");
		}
	},

	bom_no(frm) {
		if (frm.doc.bom_no && !(frm.doc.required_items || []).length) {
			get_items_from_bom(frm);
		}
	},

	production_item(frm) {
		frm.set_value("bom_no", "");
		frm.clear_table("required_items");
		frm.refresh_field("required_items");
		if (!frm.doc.production_item) return;

		// Auto-select the BOM when the item has exactly one active BOM
		frappe.db
			.get_list("BOM", {
				filters: { item: frm.doc.production_item, is_active: 1, docstatus: 1 },
				fields: ["name"],
				limit: 2,
			})
			.then((boms) => {
				if (boms.length === 1) {
					frm.set_value("bom_no", boms[0].name);
				}
			});
	},
});

function get_items_from_bom(frm) {
	frappe.db.get_doc("BOM", frm.doc.bom_no).then((bom) => {
		frm.clear_table("required_items");
		bom.items.forEach((row) => {
			frm.add_child("required_items", {
				item_code: row.item_code,
				item_name: row.item_name,
				uom: row.uom,
				// TODO: scale by Work Order qty / BOM quantity (Required Quantity calculation to be done later)
				required_qty: row.qty,
			});
		});
		frm.refresh_field("required_items");
		frappe.show_alert({ message: __("Items fetched from {0}", [bom.name]), indicator: "green" });
	});
}
