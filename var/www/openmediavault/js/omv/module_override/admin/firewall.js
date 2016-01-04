
// require("js/omv/WorkspaceManager.js")

OMV.WorkspaceManager.registerNode({
	id: "networking",
	path: "/",
	text: _("Networking"),
	position: 15
});

OMV.WorkspaceManager.registerNodeOverride({
	newpath : "/networking",
    id      : "firewall",
    path    : "/service",
//    text    : _("Firewall"),
//    icon16  : "images/firewall.png",
//    iconSvg : "images/firewall.svg"
});

OMV.WorkspaceManager.registerPanelOverride({
	newpath   : "/networking/firewall",
    id        : "settings",
    path      : "/service/firewall",
//    text      : _("Settings"),
//    position  : 10,
//    className : "OMV.module.admin.service.firewall.Settings"
});

OMV.WorkspaceManager.registerPanelOverride({
	newpath   : "/networking/firewall",
    id        : "entries",
    path      : "/service/firewall",
//    text      : _("Entries"),
//    position  : 99,
//    className : "OMV.module.admin.service.firewall.Entries"
});
