
//select categoryList which is the dropdown menu
//  and on change will run this function
//filterlist

$('select#categoryList').change(function() {
	var filter = $(this).val();
	filterList(filter);
});

// filter function
function filterList(value) {
	var list = $(".productsList .products");
	$(list).hide();
	if (value == "All") {
		$(".productsList").find("div").each(function () {
			$(this).show();
		});
	} else {
		// *=" means that if a data-custom type contains multiple values, it will find them
		$(".productsList").find("div[data-custom-type*=" + value + "]").each(function () {
			$(this).show();
		});
	}
}

console.log("category file linked")