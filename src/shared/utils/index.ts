import chalk from "chalk";

export const createPopoutUrl = ({ channel, target }: { channel: string; target: string }) => {
	console.log(chalk.blue(`Попытка открытия нового окна для канала ${channel}`));
	const url = `${location.origin}${target}?channel=${channel}`;
	console.log(chalk.blue(`Таргет нового окна ${url}`));
	return url;
};

export const createWindowPositionAndSizeOptions = (size: number) => {
	const gap = size * 25;
	const initialLeft = 100;
	const initialTop = 100;
	const left = initialLeft + gap;
	const top = initialTop + gap;

	return { left, top };
};

export const focusPopout = (target: string) => {
	const focusedWindow = window.open(
		"",
		target,
		`scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=900,height=300,left=600,top=600`,
	);

	if (focusedWindow) {
		focusedWindow.focus();
	} else {
		console.error(`Окно с именем ${target} не найдено.`);
	}
};
