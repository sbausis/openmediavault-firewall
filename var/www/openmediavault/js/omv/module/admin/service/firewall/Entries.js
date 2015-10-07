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
// require("js/omv/workspace/grid/Panel.js")
// require("js/omv/workspace/window/Form.js")
// require("js/omv/workspace/window/plugin/ConfigObject.js")
// require("js/omv/Rpc.js")
// require("js/omv/data/Store.js")
// require("js/omv/data/Model.js")
// require("js/omv/data/proxy/Rpc.js")

Ext.define("OMV.module.admin.service.firewall.Entries", {
    extend   : "OMV.workspace.grid.Panel",
    requires : [
        "OMV.Rpc",
        "OMV.data.Store",
        "OMV.data.Model",
        "OMV.data.proxy.Rpc"
    ],

    hidePagingToolbar : false,
    hideAddButton     : false,
    hideEditButton    : false,
    hideDeleteButton  : false,
    stateful          : true,
    stateId           : "9876057b-b2c0-4c48-a4c1-8c9b4fb54d7b",
    columns           : [{
        text      : _("Name"),
        sortable  : true,
        dataIndex : "id",
        stateId   : "id"
    },{
        text      : _("Path"),
        sortable  : true,
        dataIndex : "path",
        stateId   : "path"
    }],

    initComponent : function () {
        var me = this;
        Ext.apply(me, {
            //store : Ext.create("OMV.data.Store", {
            //    autoLoad : true,
            //    model    : OMV.data.Model.createImplicit({
            //        idProperty  : "id",
            //        fields      : [
            //            { name : "id", type: "string" },
            //            { name : "path", type: "string" }
            //        ]
            //    }),
            //    proxy : {
            //        type    : "rpc",
            //        rpcData : {
            //            service : "Firewall",
            //            method  : "getNodes"
            //        }
            //    }
            //})
        });
        me.callParent(arguments);
    }
});

OMV.WorkspaceManager.registerPanel({
    id        : "entries",
    path      : "/service/firewall",
    text      : _("Entries"),
    position  : 99,
    className : "OMV.module.admin.service.firewall.Entries"
});
