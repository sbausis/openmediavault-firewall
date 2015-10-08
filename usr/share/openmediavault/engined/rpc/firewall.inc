<?php
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
require_once("openmediavault/object.inc");
require_once("openmediavault/config.inc");
require_once("openmediavault/error.inc");
require_once("openmediavault/util.inc");
require_once("openmediavault/rpcservice.inc");
require_once("openmediavault/notify.inc");

class OMVRpcServiceFirewall extends OMVRpcServiceAbstract {

    /**
     * Get the RPC service name.
     */
    public function getName() {
        return "Firewall";
    }

    /**
     * Initialize the RPC service.
     */
    public function initialize() {
        $this->registerMethod("getSettings");
        $this->registerMethod("setSettings");
        $this->registerMethod("getNetworks");
		// add more Functions to your RPC-Service
    }

    /**
     * Get the settings configuration object.
     * @param params The method parameters.
     * @param context The context of the caller.
     * @return The requested configuration object.
     * @throw E_CONFIG_GET_OBJECT_FAILED
     */
    public function getSettings($params, $context) {
        global $xmlConfig;

        // Validate the RPC caller context.
        $this->validateMethodContext($context, array( "role" => OMV_ROLE_ADMINISTRATOR ));

        // Get the configuration object.
        $xpath = "//services/firewall";
        $object = $xmlConfig->get($xpath);
        if(is_null($object))
            throw new OMVException(OMVErrorMsg::E_CONFIG_GET_OBJECT_FAILED, $xpath);

        // Modify the result object.
        $object['enable']          = boolval($object['enable']);

        // Remove useless fields from the result object.
        //unset($object['ddd']);

        return $object;
    }

    /**
     * Set the settings configuration object.
     * @param params The method parameters.
     * @param context The context of the caller.
     * @return The stored configuration object.
     * @throw E_CONFIG_GET_OBJECT_FAILED
     * @throw E_CONFIG_SET_OBJECT_FAILED
     */
    public function setSettings($params, $context) {
        global $xmlConfig;

        // Validate the RPC caller context.
        $this->validateMethodContext($context, array( "role" => OMV_ROLE_ADMINISTRATOR ));

        // Validate the parameters of the RPC service method.
        $this->validateMethodParams($params, '{
            "type"       : "object",
            "properties" : {
                "enable"             : { "type" : "boolean" },
	            "public-if"          : { "type" : "string" },
	            "private-if"         : { "type" : "string" }
            }
        }');

        // Get the existing configuration object.
        $xpath = "//services/firewall";
        $oldObject = $xmlConfig->get($xpath);
        if(is_null($oldObject))
            throw new OMVException(OMVErrorMsg::E_CONFIG_GET_OBJECT_FAILED, $xpath);

		$pub = explode(" ", $params['public-if']);
		$priv = explode(" ", $params['private-if']);
		
        // Update the configuration object.
        $object = array(
            "enable" 	=> array_boolval($params, 'enable'),
			"public-if" => $pub[0],
			"public-addr" => $pub[1],
			"private-if" => $priv[0],
			"private-addr" => $priv[1]
        );

        if(FALSE === $xmlConfig->replace("//services/firewall", $object))
            throw new OMVException(OMVErrorMsg::E_CONFIG_SET_OBJECT_FAILED);

        // Notify configuration changes.
        $dispatcher = &OMVNotifyDispatcher::getInstance();
        $dispatcher->notify(OMV_NOTIFY_MODIFY, "org.openmediavault.services.firewall", $object);

        // Return the configuration object.
        return $object;
    }

    /**
     * Get a list of static networks for this machine.
     *
     * @return array networks
     */
    public function getNetworks($params, $context) {
        global $xmlConfig;

        // Validate the RPC caller context.
        $this->validateMethodContext($context, array( "role" => OMV_ROLE_ADMINISTRATOR ));

        $nets = array();
        $ints = $xmlConfig->getList("//system/network/interfaces/interface");

        foreach ($ints as $i) {
            if (! ($i['netmask'] && $i['address']))
                continue;

            $netid = "{$i['devicename']} " . long2ip(ip2long($i['address']) & ip2long($i['netmask'])) . "/{$i['netmask']}";
            $nets[$netid] = $netid;
        }

        $networks = array();
        foreach ($nets as $n) {
            $networks[] = array('netif'=> $n);
        }

        return $networks;
    }

}

// Register the RPC service.
$rpcServiceMgr = &OMVRpcServiceMgr::getInstance();
$rpcServiceMgr->registerService(new OMVRpcServiceFirewall());
