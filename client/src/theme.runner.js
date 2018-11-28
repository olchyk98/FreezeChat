const config = {
	light: {
		"--__design__navcol": "#D6D8F3",
		"--__design__minblack": "rgba(0, 0, 0, .1)",
		"--__design__ciblack": "rgba(0, 0, 0, .25)",
		"--__design__lowblack": "rgba(0, 0, 0, .4)",
		"--__design__midblack": "rgba(0, 0, 0, .7)",
		"--__design__highblack": "rgba(0, 0, 0, .95)",
		"--__design__pcwhite": "rgba(255, 255, 255, .05)",
		"--__design__lowwhite": "rgba(255, 255, 255, .1)",
		"--__design__midwhite": "rgba(255, 255, 255, .5)",
		"--__design__highwhite": "rgba(255, 255, 255, .85)",
		"--__design__navname": "black",
		"--__design__darkcol": "white",
		"--__design__homebg": "#F4F4FC",
		"--__design__homeinputbg": "white",
		"--__design__homeconvbg": "white",
		"--__design__homeconvabg": "rgb(254, 254, 254)"
	},
	dark: {
		"--__design__navcol": "#292929",
		"--__design__minblack": "rgba(255, 255, 255, .1)",
		"--__design__ciblack": "rgba(255, 255, 255, .25)",
		"--__design__lowblack": "rgba(255, 255, 255, .4)",
		"--__design__midblack": "rgba(255, 255, 255, .7)",
		"--__design__highblack": "rgba(255, 255, 255, .95)",
		"--__design__pcwhite": "rgba(0, 0, 0, .05)",
		"--__design__lowwhite": "rgba(0, 0, 0, .1)",
		"--__design__midwhite": "rgba(0, 0, 0, .5)",
		"--__design__highwhite": "rgba(0, 0, 0, .85)",
		"--__design__navname": "white",
		"--__design__darkcol": "black",
		"--__design__homebg": "#1F2020",
		"--__design__homeinputbg": "#001000",
		"--__design__homeconvbg": "#3D4142",
		"--__design__homeconvabg": "#292D2D"
	}
}

const settings = {
	"DEFAULT_THEME_VALUE": "light"
}

function run(state) {
	function run(state) {
		let a = config[state];

		if(!a) {
			console.error("Passed invalid theme_config_name (ThemeRunner)");
			return console.trace("");
		}

		Object.keys(a).forEach(io => {
			document.documentElement.style.setProperty(io, a[io]);
		});
		setTimeout(() => {
			document.documentElement.style.setProperty('--gstrans', '.4s');
		}, 500);
	}

	let b = state || localStorage.getItem("theme") || settings.DEFAULT_THEME_VALUE;
	if(state) localStorage.setItem("theme", b);

	if(state === 'OPP_MODE') b = {'dark':'light', 'light':'dark'}[b];
	localStorage.setItem("theme", b);
	run(b);
}

export default run;