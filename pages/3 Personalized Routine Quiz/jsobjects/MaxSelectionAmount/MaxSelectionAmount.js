export default {
	Button1onClick () {
		if (CheckboxGroup1.selectedValues.length > 3) {
			CheckboxGroup1.setSelectedOptions(CheckboxGroup1.selectedValues.slice(0, 3));
		}
	}
}
