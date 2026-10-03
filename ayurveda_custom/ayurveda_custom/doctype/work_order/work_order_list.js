frappe.listview_settings["Work Order"] = {
	add_fields: ["status"],
	get_indicator(doc) {
		const colors = {
			Draft: "red",
			"In Progress": "orange",
			"QC Pending": "yellow",
			Completed: "green",
		};
		return [__(doc.status), colors[doc.status] || "gray", "status,=," + doc.status];
	},
};
