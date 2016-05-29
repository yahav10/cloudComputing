
function getImage(){
	Input = document.getElementById("imageId");
	Size = document.getElementById("imageSize");

	if(Input.value==""){
		alert("Please Enter Id Number Between 1-33");
		return;
	}
	
	url = 'https://s3-us-west-2.amazonaws.com/galshaharbucket/pic'+Input.value+Size.value+'.jpg';

	if(Size.value=="L"){
		popupWindow = window.open(
		url,'popUpWindow','height=908,width=1380,left=10,top=10,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes')
	}

	if(Size.value=="M"){
		popupWindow = window.open(
		url,'popUpWindow','height=575,width=920,left=10,top=10,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes')
	}

	if(Size.value=="S"){
		popupWindow = window.open(
		url,'popUpWindow','height=380,width=620,left=10,top=10,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes')
	}

}