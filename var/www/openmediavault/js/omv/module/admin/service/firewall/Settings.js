/**
 * @license     http://www.gnu.org/licenses/gpl.html GPL Version 3
 * @author      Simon Baur <sbausis@gmx.net>
 * @copyright   Copyright (c) 2015 Simon Baur
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
// require("js/omv/WorkspaceManager.js")
// require("js/omv/workspace/form/Panel.js")
// require("js/omv/workspace/window/Form.js")
// require("js/omv/data/Store.js")
// require("js/omv/data/Model.js")
// require("js/omv/data/proxy/Rpc.js")
// require("js/omv/workspace/window/plugin/ConfigObject.js")

Ext.define("OMV.module.admin.service.firewall.Settings", {
    extend : "OMV.workspace.form.Panel",

    plugins : [{
        ptype        : "linkedfields",
        correlations : [{
            name       : [
                "settings"
            ],
            conditions : [{
                name  : "dhcp-enable",
                value : false
            }]
        }]
    }],

    initComponent : function () {
        var me = this;

        me.on('load', function () {
            var checked = me.findField('enable').checked;
            var parent = me.up('tabpanel');

            if (!parent)
                return;

            var entriesPanel = parent.down('panel[title=' + _("Entries") + ']');

            if (entriesPanel) {
                checked ? entriesPanel.enable() : entriesPanel.disable();
            }
        });

        me.callParent(arguments);
    },

    rpcService   : "Firewall",
    rpcGetMethod : "getSettings",
    rpcSetMethod : "setSettings",

    getFormItems: function () {
        return [{
            xtype    : "fieldset",
            title    : _("General"),
            defaults : {
                labelSeparator : ""
            },
            items    : [{
                xtype      : "checkbox",
                name       : "enable",
                fieldLabel : _("Enable"),
                checked    : false
            },
			{
	            xtype    : "fieldset",
				name     : "settings",
	            title    : _("Settings"),
	            defaults : {
	                labelSeparator : ""
	            },
	            items    : [
					{
		                xtype         : "combo",
		                name          : "public-if",
		                hiddenName    : "public-if",
		                fieldLabel    : _("Public Network"),
		                emptyText     : _("Select a network ..."),
		                allowBlank    : false,
		                editable      : true,
		                triggerAction : "all",
		                displayField  : "netif",
		                valueField    : "netif",
		                store         : Ext.create("OMV.data.Store", {
		                    autoLoad : true,
		                    model    : OMV.data.Model.createImplicit({
		                        idProperty  : "netif",
		                        fields      : [
		                            { name : "netif", type : "string" }
		                        ]
		                    }),
		                    proxy : {
		                        type : "rpc",
		                        rpcData : {
		                            service : "Firewall",
		                            method  : "getNetworks"
		                        },
		                        appendSortParams : false
		                    },
		                    sorters : [{
		                        direction : "ASC",
		                        property  : "netif"
		                    }]
		                })
		            },
					{
		                xtype         : "combo",
		                name          : "private-if",
		                hiddenName    : "private-if",
		                fieldLabel    : _("Private Network"),
		                emptyText     : _("Select a network ..."),
		                allowBlank    : false,
		                editable      : true,
		                triggerAction : "all",
		                displayField  : "netif",
		                valueField    : "netif",
		                store         : Ext.create("OMV.data.Store", {
		                    autoLoad : true,
		                    model    : OMV.data.Model.createImplicit({
		                        idProperty  : "netif",
		                        fields      : [
		                            { name : "netif", type : "string" }
		                        ]
		                    }),
		                    proxy : {
		                        type : "rpc",
		                        rpcData : {
		                            service : "Firewall",
		                            method  : "getNetworks"
		                        },
		                        appendSortParams : false
		                    },
		                    sorters : [{
		                        direction : "ASC",
		                        property  : "netif"
		                    }]
		                })
		            }
				]
			}]
        }];
    }
});

OMV.WorkspaceManager.registerPanel({
    id        : "settings",
    path      : "/service/firewall",
    text      : _("Settings"),
    position  : 10,
    className : "OMV.module.admin.service.firewall.Settings"
});
