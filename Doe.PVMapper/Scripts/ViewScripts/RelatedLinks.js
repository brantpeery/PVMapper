/*
    Adds dropdown for related links to toolbar
    Author: Darian Ramage, BYU
    Edited By Scott Brown, INL
*/

pvMapper.onReady(function () {
    pvMapper.linksToolbarMenu.add([{
        text: 'PVWatts',
        iconCls: 'x-NREL-menu-icon',
        tooltip: 'A calculator to determine the energy production and cost savings of grid-connected photovoltaic (PV) energy systems throughout the world',
        handler: function () {
            window.open('http://www.nrel.gov/rredc/pvwatts/');
        }
    }, {
        text: 'System Advisor Model (SAM)',
        iconCls: 'x-NREL-menu-icon',
        tooltip: 'A modeling tool for performance predictions and cost of energy estimates for grid-connected power projects based on installation and operating costs and system design parameters',
        handler: function () {
            window.open('https://sam.nrel.gov/');
        }
    }, {
        text: 'EISPC EZ Mapping Tool',
        iconCls: 'x-eispclogo-menu-icon',
        tooltip: 'A map‑based tool for identifying areas within the eastern United States that may be suitable for clean power generation',
        handler: function () {
            window.open('http://eispctools.anl.gov/');
        }
    }, {
        text: 'ANL Solar Mapper',
        iconCls: 'x-anllogo-menu-icon',
        tooltip: 'A web-based application that displays environmental data for the southwest U.S. in the context of utility-scale solar energy development',
        handler: function () {
            window.open('http://solarmapper.anl.gov/');
        }
    }, {
        text: 'DSIRE Database',
        iconCls: 'x-dsirelogo-menu-icon',
        tooltip: 'A comprehensive source of information on incentives and policies that support renewables and energy efficiency in the United States',
        handler: function () {
            window.open('http://www.dsireusa.org/');
        }
    }, {
        text: 'EPA RE-Powering',
        iconCls: 'x-epa-menu-icon',
        tooltip: 'EPA resources for siting renewable energy on potentially contaminated lands, landfills, and mine sites',
        handler: function () {
            window.open('http://www.epa.gov/renewableenergyland/');
        }
    }]);
});