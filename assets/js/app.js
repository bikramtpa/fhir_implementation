//var tutUrl = 'http://tutsgn.fi:8080/tutsgnfhir/';
var tutUrl = 'http://fhirtest.uhn.ca/baseDstu2/';
var app = angular.module('healthLabApp', ['ngRoute', 'datatables']);

app.config(['$routeProvider','$locationProvider', function ($routeProvider, $locationProvider){
    $routeProvider.
      when('/patient', {
        templateUrl: 'views/patient/index.html',
        controller: 'listpatient'
      }).
      when('/add-patient', {
        templateUrl: 'views/patient/add-patient.html',
        controller: 'add-patient'
      }).
      when('/edit-patient', {
        templateUrl: 'views/patient/edit-patient.html',
        controller: 'edit-patient'
      }).
      when('/delete-patient', {
        templateUrl: 'views/patient/delete-patient.html',
        controller: 'delete-patient'
      }).
      when('/create-organization', {
	templateUrl: 'views/organization/index.html',
	controller: 'create-organization'
      }).
      when('/delete-organization', {
	templateUrl: 'views/organization/delete-organization.html',
	controller: 'delete-organization'
      }).
      when('/edit-organization', {
	templateUrl: 'views/organization/edit-organization.html',
	controller: 'organization'
      }).
      when('/organization', {
	templateUrl: 'views/organization/list.html',
	controller: 'organization'
      }).
      otherwise({
        templateUrl: 'views/mainview.html',
        controller: 'his'
      });
    $locationProvider.html5Mode(true);
  }]);
  
app.run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
    var original = $location.path;
    $location.path = function (path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
            });
        }
        return original.apply($location, [path]);
    };
    //$location.path('/patient', false);
}]);


  
app.controller('add-patient', function($scope, $http){
	var uniqueId = guid();
	$scope.identifier = uniqueId;

	$scope.saveInfo = function(){
		var identifier = $scope.identifier;
		var active = $scope.active;
		var prefix = $scope.prefix;
		var name = $scope.fullname;
		var gender = $scope.gender;
		var phone = $scope.phone;
		var email = $scope.email;
		var birthdate = $scope.birthdate;
		var phone = $scope.phone;
		var addresstype = $scope.addresstype;
		var street = $scope.street;
		var city = $scope.city;
		var postal = $scope.postalcode;
		var country = $scope.country;
		var photourl = $scope.photourl;
		var language = $scope.language;
		var preferredlanguage = $scope.lanugagepreferred;
		var careprovider = $scope.careprovider;
		var photo = $scope.photourl;

		var relationtype = $scope.relationtype;
		var relationaddressuse = $scope.relationaddresstype;
		var relationfullname = $scope.relationfullname;
		var relationgender = $scope.relationgender;
		var relationphone = $scope.relationphone;
		var relationemail = $scope.relationemail;
		var relationstreet = $scope.relationstreet;
		var relationcity = $scope.relationcity;
		var relationpostalcode = $scope.relationpostalcode;
		var relationcountry = $scope.relationcountry;

		var xmldata = '<Patient xmlns="http://hl7.org/fhir"><identifier><use value="official"/><value value="'+identifier+'"/></identifier><active value="'+active+'"/><name><use value="usual"/><text value="'+name+'"/><prefix value="'+prefix+'"/></name><telecom><system value="phone"/><value value="'+phone+'"/></telecom><telecom><system value="email"/><value value="'+email+'"/></telecom><gender value="'+gender+'"/><birthDate value="'+birthdate+'"/><address><use value="'+addresstype+'"/><line value="'+street+'"/><city value="'+city+'"/><postalCode value="'+postal+'"/><country value="'+country+'"/></address><maritalStatus></maritalStatus><photo><url value="'+photo+'"/></photo><contact><relationship><coding><system value="http://hl7.org/fhir/patient-contact-relationship"/><code value="'+relationtype+'"/><display value="'+relationtype+'"/></coding></relationship><name><use value="'+relationaddressuse+'"/><text value="'+relationfullname+'"/></name><telecom><system value="phone"/><value value="'+relationphone+'"/></telecom><telecom><system value="email"/><value value="'+relationemail+'"/></telecom><address><use value="home"/><line value="'+relationstreet+'"/><city value="'+relationcity+'"/><postalCode value="'+relationpostalcode+'"/><country value="'+relationcountry+'"/></address><gender value="'+relationgender+'"/></contact><communication><language><coding><system value="http://hl7.org/fhir/identifier-type"/><code value="'+language+'"/></coding></language><preferred value="'+preferredlanguage+'"/></communication><careProvider><display value="'+careprovider+'"/></careProvider></Patient>';	
		$http({
		    contentType: "application/xml+fhir; charset=UTF-8",
		    dataType:'xml',
		    method: 'POST',
		    url: tutUrl+"Patient?_format=xml&_pretty=true",
		    data: xmldata,
		    headers: { "Content-Type": 'application/xml' }
		}).success(function (data, status, headers, config) {
			alert("Succefully added new record.");
        		alert(data);
    		}).error(function (data, status, headers, config) {
			alert("Error occured during adding Record. Please check logs on browser.");
			console.log(data);
    		});
	}
 });

app.controller('edit-patient', function($scope, $http){
	$scope.searchdata = function(){

		var searchUrl = tutUrl + "Patient/"+$scope.searchIdentifier;
	        $http.get(searchUrl).success(function (response){
			console.log(response);
			$scope.id = response.id;
			$scope.visibilityMode= true;
			$scope.id = response.id;
			$scope.identifier = response.identifier[0].value;
			$scope.activated = {
			   active : response.active
			 };
			$scope.prefix = {
				title: 	response.name[0].prefix[0]
			};

			$scope.fullname = response.name[0].text;
			$scope.genders = {
				gender: "male"
			};
			$scope.phone = response.telecom[0].value;
			$scope.email = response.telecom[1].value;
			$scope.birthdate = response.birthDate;
			$scope.phone = response.telecom[0].value;
			$scope.addresstype = response.address[0].use;
			$scope.street = response.address[0].line[0];
			$scope.city = response.address[0].city;
			$scope.postalcode = response.address[0].postalCode;
			$scope.country = response.address[0].country;
			$scope.photourl = response.photo[0].url;
			$scope.language = response.communication[0].language.coding[0].code;
			$scope.preferred = {
			   prefer : response.communication[0].preferred
			 };
			$scope.careprovider = response.careProvider[0].display;

			$scope.relationtype = response.contact[0].relationship[0].coding[0].code;
			$scope.relationaddresstype = response.contact[0].name.use;
			$scope.relationfullname = response.contact[0].name.text;
			$scope.relationgender = response.contact[0].gender;
			$scope.relationgenders = {
			   gender: $scope.relationgender
			};
			$scope.relationphone = response.contact[0].telecom[0].value;
			$scope.relationemail = response.contact[0].telecom[1].value;
			$scope.relationstreet = response.contact[0].address.line[0];
			$scope.relationcity = response.contact[0].address.city;
			$scope.relationpostalcode = response.contact[0].address.postalCode;
			$scope.relationcountry = response.contact[0].address.country;
		}).error(function(err){
			console.log(err);
		});
	}

	$scope.editData = function(){

		var identifier = $scope.identifier;
		var active = $scope.activated.active;
		var prefix = $scope.prefix.title;
		var name = $scope.fullname;
		var gender = $scope.genders.gender;
		var phone = $scope.phone;
		var email = $scope.email;
		var birthdate = $scope.birthdate;
		var phone = $scope.phone;
		var addresstype = $scope.addresstype;
		var street = $scope.street;
		var city = $scope.city;
		var postal = $scope.postalcode;
		var country = $scope.country;
		var photourl = $scope.photourl;
		var language = $scope.language;
		var preferredlanguage = $scope.preferred.prefer;
		var careprovider = $scope.careprovider;
		var photo = $scope.photourl;

		var relationtype = $scope.relationtype;
		var relationaddressuse = $scope.relationaddresstype;
		var relationfullname = $scope.relationfullname;
		var relationgender = $scope.relationgenders.gender;
		var relationphone = $scope.relationphone;
		var relationemail = $scope.relationemail;
		var relationstreet = $scope.relationstreet;
		var relationcity = $scope.relationcity;
		var relationpostalcode = $scope.relationpostalcode;
		var relationcountry = $scope.relationcountry;

		var xmldata = '<Patient xmlns="http://hl7.org/fhir"><id value="'+$scope.id+'"/><identifier><use value="official"/><value value="'+identifier+'"/></identifier><active value="'+active+'"/><name><use value="usual"/><text value="'+name+'"/><prefix value="'+prefix+'"/></name><telecom><system value="phone"/> <value value="'+phone+'"/> </telecom><telecom><system value="email"/><value value="'+email+'"/></telecom><gender value="'+gender+'"/><birthDate value="'+birthdate+'"/><address><use value="'+addresstype+'"/><line value="'+street+'"/><city value="'+city+'"/><postalCode value="'+postal+'"/><country value="'+country+'"/></address><maritalStatus></maritalStatus><photo><url value="'+photo+'"/></photo><contact><relationship><coding><system value="http://hl7.org/fhir/patient-contact-relationship"/><code value="'+relationtype+'"/><display value="'+relationtype+'"/></coding></relationship><name><use value="'+relationaddressuse+'"/><text value="'+relationfullname+'"/></name><telecom><system value="phone"/><value value="'+relationphone+'"/></telecom><telecom><system value="email"/><value value="'+relationemail+'"/></telecom><address><use value="home"/><line value="'+relationstreet+'"/><city value="'+relationcity+'"/><postalCode value="'+relationpostalcode+'"/><country value="'+relationcountry+'"/></address><gender value="'+relationgender+'"/></contact><communication><language><coding><system value="http://hl7.org/fhir/identifier-type"/><code value="'+language+'"/></coding></language><preferred value="'+preferredlanguage+'"/></communication><careProvider><display value="'+careprovider+'"/></careProvider></Patient>';

		var putUrl = tutUrl + "Patient/"+ $scope.id + "?_format=xml&_pretty=true";
			$http({
			    contentType: "application/xml+fhir; charset=UTF-8",
			    dataType:'xml',
			    method: 'PUT',
			    url: putUrl,
			    data: xmldata,
			    headers: { "Content-Type": 'application/xml' }
			}).success(function (data, status, headers, config) {
				alert("Successfully updated records");
				console.log(data);
				//history.pushState({}, "Organizations", "./organization");
	    		}).error(function (data, status, headers, config) {
				alert("Failed to update, check the log status");
				console.log(data);
	    		});		







	}

 });

app.controller('delete-patient', function($scope, $http){
	  $scope.deletePatient = function(){
	 	var x = confirm("Are you sure you want to delete this Patients Record - "+$scope.deleteIdentifier);
		if (x){
			var putUrl = tutUrl + "Patient/"+ $scope.deleteIdentifier + "?_format=xml&_pretty=true";
			$http({
			    contentType: "application/xml+fhir; charset=UTF-8",
			    dataType:'xml',
			    method: 'DELETE',
			    url: putUrl,
			    headers: { "Content-Type": 'application/xml' }
			}).success(function (data, status, headers, config) {
				alert("Successfully Deleted Record. ");
	    		}).error(function (data, status, headers, config) {
				alert("Failed to delete, check the log status");
				console.log(data);
	    		});
		  }
		  else{
			//alert("Delete Operation Cancelled");
		}
	};
});

 
app.controller('his', function($scope){
   $scope.title = "";
 });
 
 app.controller('appointment', function($scope){
   
 });
app.controller('create-organization', function($scope, $http){
	var uniqueId = guid();
	$scope.identifier = uniqueId;
	$scope.postrequest = function(){
		// Get the form values and send to server to save it.	
		var type = $scope.orgntype;
		var activevalue = $scope.activated.active;
		var name = $scope.name;
		var telecom = $scope.phone;
		var country = $scope.country;
		var city = $scope.city;
		var postal = $scope.postal;
                var line = $scope.street;

		var xmldata = '<Organization xmlns="http://hl7.org/fhir"><identifier><system value="urn:ietf:rfc:3986"/><!--Fake Value--><value value="'+ uniqueId +'"/><!--AutoGenerated Random Value--></identifier> <name value="'+ name +'"/><active value="'+ activevalue +'"/><type><!-- <coding><system value="urn:oid:2.16.840.1.113883.2.4.15.1060"/><code value="V6"/><display value="University Medical Hospital"/></coding>--><coding><system value="http://hl7.org/fhir/organization-type"/><code value="'+ type +'"/></coding></type> <telecom><system value="phone"/><value value="'+ telecom +'"/></telecom> <address><line value="'+ line +'"/><city value="'+ city +'"/><postalCode value="'+ postal +'"/><country value="' + country + '"/></address></Organization>';

		$http({
		    contentType: "application/xml+fhir; charset=UTF-8",
		    dataType:'xml',
		    method: 'POST',
		    url: tutUrl+"Organization?_format=xml&_pretty=true",
		    data: xmldata,
		    headers: { "Content-Type": 'application/xml' }
		}).success(function (data, status, headers, config) {
			alert("Successfully created an Organization");
        		//console.log(data);
			//history.pushState({}, "Organizations", "./organization");
    		}).error(function (data, status, headers, config) {
			alert("failure");
        		console.log(data);
    		});
	};
});

app.controller('edit-organization', function($scope, $document, $http, $routeParams){
	$scope.visibilityMode = false;
	
	$scope.searchdata = function(){
		var searchUrl = tutUrl + "Organization/"+$scope.searchIdentifier;
	        $http.get(searchUrl).success(function (response){
		$scope.activated = {
	  		 active : response.active
		};
		    $scope.visibilityMode = true;
		    $scope.id = response.id;
		    $scope.identifier = response.identifier[0].value;
		    $scope.active = $scope.activated.active;
		    $scope.orgntype = response.type.coding[0].code;
		    $scope.name = response.name;
                    $scope.phone = response.telecom[0].value;
		    $scope.city = response.address[0].city;
		    $scope.country = response.address[0].country;
		    $scope.street = response.address[0].line;
		    $scope.postal = response.address[0].postalCode;



		$scope.putrequest = function(){
			var uniqueId = $scope.identifier;
			var type = $scope.orgntype;
			var activevalue = $scope.activated.active;
			var name = $scope.name;
			var telecom = $scope.phone;
			var country = $scope.country;
			var city = $scope.city;
			var postal = $scope.postal;
		        var line = $scope.street;

			var xmldata = '<Organization xmlns="http://hl7.org/fhir"><id value="'+$scope.id+'"/><identifier><system value="urn:ietf:rfc:3986"/><!--Fake Value--><value value="'+ uniqueId +'"/><!--AutoGenerated Random Value--></identifier> <name value="'+ name +'"/><active value="'+ activevalue +'"/><type><coding><system value="http://hl7.org/fhir/organization-type"/><code value="'+ type +'"/></coding></type> <telecom><system value="phone"/><value value="'+ telecom +'"/></telecom> <address><line value="'+ line +'"/><city value="'+ city +'"/><postalCode value="'+ postal +'"/><country value="' + country + '"/></address></Organization>';

			var putUrl = tutUrl + "Organization/"+ $scope.id + "?_format=xml&_pretty=true";
			$http({
			    contentType: "application/xml+fhir; charset=UTF-8",
			    dataType:'xml',
			    method: 'PUT',
			    url: putUrl,
			    data: xmldata,
			    headers: { "Content-Type": 'application/xml' }
			}).success(function (data, status, headers, config) {
				alert("Successfully updated Information");
				console.log(data);
				//history.pushState({}, "Organizations", "./organization");
	    		}).error(function (data, status, headers, config) {
				alert("Failed to update, check the log status");
				console.log(data);
	    		});		
		
		}


		}).error(function(err){console.log(err);});
	}
});

app.controller('delete-organization', function($scope, $http){
	  $scope.deleteOrganization = function(){
	 	var x = confirm("Are you sure you want to delete this organization, ID- "+$scope.deleteIdentifier);
		if (x){
			var putUrl = tutUrl + "Organization/"+ $scope.deleteIdentifier + "?_format=xml&_pretty=true";
			$http({
			    contentType: "application/xml+fhir; charset=UTF-8",
			    dataType:'xml',
			    method: 'DELETE',
			    url: putUrl,
			    headers: { "Content-Type": 'application/xml' }
			}).success(function (data, status, headers, config) {
				alert("Successfully Deleted Record. ");
	    		}).error(function (data, status, headers, config) {
				alert("Failed to delete, check the log status");
				console.log(data);
	    		});
		  }
		  else{
			//alert("Delete Operation Cancelled");
		}
	};
});


app.controller('organization', function($scope, $http){
        $http.get(tutUrl+"Organization/_history?_count=30&_sort=desc").success(function (response){
            $scope.organizations = response.entry;
        });
});

 app.controller('listpatient', function($scope, $http){
        $http.get(tutUrl+"Patient/_history?_count=30&_sort=desc").success(function (response){
            $scope.entries = response.entry;
        });
 });

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
