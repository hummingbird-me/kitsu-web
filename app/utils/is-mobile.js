export default function() {
	const md = new MobileDetect(window.navigator.userAgent);

	return md.mobile();
}