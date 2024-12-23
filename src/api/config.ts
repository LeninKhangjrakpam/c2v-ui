export const apiBaseUrl = "http://127.0.0.1:8000";

type apiService = "uploadPage" | "genPanels" | "genAssets";

export const apiStore = (service: apiService): URL => {
	switch (service) {
		case "uploadPage":
			return new URL("uploadPages", apiBaseUrl);
		case "genPanels":
			return new URL("generatePanels", apiBaseUrl);
		case "genAssets":
			return new URL("generateAssets", apiBaseUrl);
		default:
			console.error("Service not recognised");
			throw new Error(`${service} is not available`);
	}
};
