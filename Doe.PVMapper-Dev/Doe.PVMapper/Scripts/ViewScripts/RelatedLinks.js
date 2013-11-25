/*
    Adds dropdown for related links to toolbar
    Author: Darian Ramage, BYU
*/

pvMapper.onReady(function () {
    pvMapper.linksToolbarMenu.add([{
        text: 'PVWatts',
        tooltip: 'A calculator to determine the energy production and cost savings of grid-connected photovoltaic (PV) energy systems throughout the world',
        handler: function () {
            window.open('http://www.nrel.gov/rredc/pvwatts/');
        }
    }, {
        text: 'System Advisor Model (SAM)',
        tooltip: 'A modeling tool for performance predictions and cost of energy estimates for grid-connected power projects based on installation and operating costs and system design parameters',
        handler: function () {
            window.open('https://sam.nrel.gov/');
        }
    }, {
        text: 'EISPC EZ Mapping Tool',
        tooltip: 'A map‑based tool for identifying areas within the eastern United States that may be suitable for clean power generation',
        handler: function () {
            window.open('http://eispctools.anl.gov/');
        }
    }, {
        text: 'ANL Solar Mapper',
        tooltip: 'A web-based application that displays environmental data for the southwest U.S. in the context of utility-scale solar energy development',
        handler: function () {
            window.open('http://solarmapper.anl.gov/');
        }
    }, {
        text: 'DSIRE Database',
        tooltip: 'A comprehensive source of information on incentives and policies that support renewables and energy efficiency in the United States',
        handler: function () {
            window.open('http://www.dsireusa.org/');
        }
    }]);
});