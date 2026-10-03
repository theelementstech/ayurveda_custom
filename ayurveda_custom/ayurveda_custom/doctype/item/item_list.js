frappe.listview_settings["Item"] = {
	add_fields: ["disabled"],
	get_indicator(doc) {
		return doc.disabled
			? [__("Disabled"), "gray", "disabled,=,1"]
			: [__("Enabled"), "green", "disabled,=,0"];
	},
};
