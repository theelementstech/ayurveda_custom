frappe.listview_settings["BOM"] = {
	add_fields: ["is_active"],
	get_indicator(doc) {
		return doc.is_active
			? [__("Active"), "green", "is_active,=,1"]
			: [__("Not Active"), "gray", "is_active,=,0"];
	},
};
