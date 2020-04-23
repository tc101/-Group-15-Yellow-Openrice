function Header() {
      const headerStyle = {
        background: 'url("../images/header_background.jpg") 0 0 / contain'
      };
      return (
        <header className="container text-center" style={headerStyle}>
          <h1 className="text-warning p-4">          </h1>
          <h1 className="text-warning p-4">HK Restaurant Guide</h1>
        </header>
      );
    }

    class Nav extends React.Component{
      constructor(props) {
        super(props);
        this.state ={username: props.username, userType: props.userType};
        // Test
        console.log(this.state);
        this.LogoutUser = this.LogoutUser.bind(this);
        this.ToProfile = this.ToProfile.bind(this);
        this.ToHome = this.ToHome.bind(this);
        this.ToManageRest = this.ToManageRest.bind(this);
        this.ToManageUser = this.ToManageUser.bind(this);
        this.ClickLogin = this.ClickLogin.bind(this);
        this.ClickRegister = this.ClickRegister.bind(this);
      }
      LogoutUser(){
        this.props.handleChangeToken('');
        this.setState({username: null });
        this.ToHome();
      }

      SetUserName(name){
        this.setState({username: name});
      }
      ToProfile() {
        this.props.handleChangePage('Profile');
      }
      ToHome() {
        this.props.handleChangePage('Home');
      }
      ToManageRest(){
        this.props.handleChangePage('ManageRest');
      }
      ToManageUser(){
        this.props.handleChangePage('ManageUser');
      }
      LoginUser(){
        const typeStyle = {
          color: '#9b870c'
        };
        if(this.props.username && this.props.userType=='admin'){
          return (

                <div>
                <h4 className="d-inline navbar-brand"><span style={typeStyle}>({this.props.userType})</span></h4>
                <a className="btn navbar-brand mx-2" href="javascript:;" onClick={this.ToManageRest}>Manage Restaurant</a>
                <a className="btn navbar-brand mx-2" href="javascript:;" onClick={this.ToManageUser}>Manage User</a>
                <a className="btn navbar-brand mx-2" href="javascript:;" onClick={this.LogoutUser}>Logout</a>
             </div>
            );
        }else if(this.props.username){
          return (
            <div className="dropdown">
              <button className="btn dropdown-toggle nav-btn" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <h4 className="d-inline navbar-brand">{this.props.username} <span style={typeStyle}>({this.props.userType})</span></h4>
              </button>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a className="dropdown-item" href="javascript:;" onClick={this.ToProfile}>Profile</a>
                <a className="dropdown-item" href="javascript:;" onClick={this.LogoutUser}>Logout</a>
              </div>
            </div>);
        }
        return <a className="btn navbar-brand mx-2" onClick={this.ClickLogin}><span className="nav-btn">Login</span></a>;
      }

	ClickLogin() {
		$("#loginForm").fadeIn();
		this.props.handleToggleMask();
	}
	ClickRegister() {
		$("#registerForm").fadeIn();
		this.props.handleToggleMask();
	}
      ShowRegister(){
        if(this.props.username){
          return ;
        }
        return <a className="btn navbar-brand mx-2" onClick={this.ClickRegister}><span className="nav-btn">Register</span></a>;
      }
      render(){
        return(
          <nav className="container navbar navbar-light bg-light justify-content-between nav">
            <h4><a className="btn navbar-brand mx-2" onClick={this.ToHome}><span className="nav-btn">Home</span></a></h4>

            <h4>{this.ShowRegister()}</h4>
            <h4>{this.LoginUser()}</h4>

          </nav>
        )
      }
    }

    class RegisterForm extends React.Component{
      constructor(props) {
        super(props);
        this.state = {
          nameError: '',
          emailError: '',
          passwordError: '',
          againPasswordError: '',
          name: '',
          email: '',
          password: '',
          againPassword: '',
          registerResult: ''
        };
        this.handleRegister = this.handleRegister.bind(this);
        this.generateError = this.generateError.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
      }
      isEmail(mail) {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return mail.match(mailformat) != null;
      }

      generateError() {
        let hasError = false;

        if (this.state.name == '') {
          this.setState({nameError: 'Nick name must not be empty'});
          hasError = true;
        }
        else {
          this.setState({nameError: ''});
        }

        if (!this.isEmail(this.state.email)) {
          this.setState({emailError: 'Email format incorrect!'});
          hasError = true;
        }
        else {
          this.setState({emailError: ''});
        }

        if (this.state.password != this.state.againPassword) {
          this.setState({
            passwordError: 'Two passwords must be equal.',
            againPasswordError: 'Two passwords must be equal.'
          });
          hasError = true;
        }
        else if (this.state.password == '') {
          this.setState({
            passwordError: 'Password cannot be empty.',
            againPasswordError: 'Password cannot be empty.'
          });
          hasError = true;
        }
        else {
          this.setState({
            passwordError: '',
            againPasswordError: ''
          });
        }

        return hasError;
      }

      handleRegister() {
        const hasError = this.generateError();
        if (hasError) {
            $("#registerForm").effect( "shake", { direction: "right", times: 4, distance: 10}, 500 );
        }
        else {
          // Simple POST request with a JSON body using fetch
          const requestOptions = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({  email: this.state.email,
                                      name: this.state.name,
                                      password: this.state.password})
          };

          fetch(this.props.URL + '/register', requestOptions)
              .then(response => response.json())
              .then(data => {
                let success = {
                  color: 'green',
                  paddingLeft: '20px'
                };
                let fail = {
                  color: 'red',
                  paddingLeft: '20px'
                };
                if (data.response == 'success') {
                    this.props.handleChangeToken(data.token);
                    $("#registerForm").slideUp();
				            this.props.handleToggleMask();
                    const msg = `Thank you for your registration. An email has been sent to ${this.state.email}. Please click the link in the email to activate your account`;
                    this.props.handlePopupMsg(msg);
                    this.setState({
                      nameError: '',
                      emailError: '',
                      passwordError: '',
                      againPasswordError: '',
                      name: '',
                      email: '',
                      password: '',
                      againPassword: '',
                      registerResult: ''
                    });
                }
                else {
                    $("#registerForm").effect( "shake", { direction: "right", times: 4, distance: 10}, 500 );
                    this.setState({emailError: data.message});
                }
              });


        }
      }

      handleInputChange(e){
          const target = e.target;
          const value = target.type === 'checkbox' ? target.checked : target.value;
          const name = target.name;
          this.setState({
              [name]: value
          });
      }

      render() {
        let inputError = {
          fontSize: 'small',
          color: 'red',
          paddingLeft: '20px'
        };
        return (
          <div className="form" id="registerForm">
            <img src="../images/restaurant2.jpg" style={{height: '160px', width: '100%', paddingBottom: '20px', objectFit: 'cover'}} />
            <section id="inner-wrapper" className="login">
              <article>
                <form id="loginSubmitForm">
                  <div className="form-group">
                    <div className="input-group">
                      <span className="input-group-addon"><i className="fa fa-user fa-fw"> </i></span>
                      <input
                        id="registerName"
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Nick Name"
                        onChange={this.handleInputChange}
                        value={this.state.name}
                      />
                    </div>
                    <p style={inputError}>{this.state.nameError}</p>
                  </div>
                  <div className="form-group">
                    <div className="input-group">
                      <span className="input-group-addon"><i className="fa fa-envelope fa-fw"> </i></span>
                      <input
                        id="registerEmail"
                        type="text"
                        name="email"
                        className="form-control"
                        placeholder="Email Address"
                        onChange={this.handleInputChange}
                        value={this.state.email}
                      />
                    </div>
                    <p style={inputError}>{this.state.emailError}</p>
                  </div>
                  <div className="form-group">
                    <div className="input-group">
                      <span className="input-group-addon"><i className="fa fa-key fa-fw"> </i></span>
                      <input
                        id="registerPassword"
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        name="password"
                        onChange={this.handleInputChange}
                        value={this.state.password}
                      />
                    </div>
                    <p style={inputError}>{this.state.passwordError}</p>
                  </div>
                  <div className="form-group">
                    <div className="input-group">
                      <span className="input-group-addon"><i className="fa fa-key fa-fw"> </i></span>
                      <input
                        id="registerRePassword"
                        type="password"
                        name="againPassword"
                        className="form-control"
                        placeholder="Enter Password Again"
                        onChange={this.handleInputChange}
                        value={this.state.againPassword}
                      />
                    </div>
                  </div>
                </form>
                <button className="btn btn-warning btn-block" onClick={this.handleRegister}>Register</button>
                <p style={this.state.registerResultStyle}>{this.state.registerResult}</p>
              </article>
            </section>
          </div>
        );
      }
    }

    class LoginForm extends React.Component{

      constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.generateError = this.generateError.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

        this.state = {
          email: '',
          password: '',
          emailError: '',
          passwordError: ''
        };
      }

      isEmail(mail) {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return mail.match(mailformat) != null;
      }

      generateError() {
        let hasError = false;

        if (!this.isEmail(this.state.email)) {
          this.setState({emailError: 'Email format incorrect!'});
          hasError = true;
        }
        else {
          this.setState({emailError: ''});
        }

        if (this.state.password == '') {
          this.setState({
            passwordError: 'Password cannot be empty.'
          });
          hasError = true;
        }
        else {
          this.setState({passwordError: ''});
        }

        return hasError;
      }

      handleLogin() {
        const hasError = this.generateError();
        if (hasError) {
            $("#loginForm").effect( "shake", { direction: "right", times: 4, distance: 10}, 500 );
        }
        else {
          // Simple POST request with a JSON body using fetch
          const requestOptions = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({  email: this.state.email,
                                      password: this.state.password})
          };

          fetch(this.props.URL + '/login', requestOptions)
              .then(response => response.json())
              .then(data => {
                let success = {
                  color: 'green',
                  paddingLeft: '20px'
                };
                let fail = {
                  color: 'red',
                  paddingLeft: '20px'
                };
                if (data.response == 'success') {
                    $("#loginForm").fadeOut();
                    this.props.handleChangeToken(data.token);
				            this.props.handleToggleMask();
                    this.setState({
                      password: '',
                      emailError: '',
                      passwordError: ''})
                }
                else {
                    $("#loginForm").effect( "shake", { direction: "right", times: 4, distance: 10}, 500 );
                    this.setState({passwordError: data.message});
                }
              });


        }
      }

      handleInputChange(e){
          const target = e.target;
          const value = target.type === 'checkbox' ? target.checked : target.value;
          const name = target.name;
          this.setState({
              [name]: value
          });
      }

      render() {
        let inputError = {
          fontSize: 'small',
          color: 'red',
          paddingLeft: '20px'
        };
        return (
          <div className="form" id="loginForm">
            <img src="../images/restaurant.jpg" style={{height: '160px', width: '100%', paddingBottom: '20px', objectFit: 'cover'}} />
            <section id="inner-wrapper" className="login">
              <article>
                <form id="loginSubmitForm">
                  <div className="form-group">
                    <div className="input-group">
                      <span className="input-group-addon"><i className="fa fa-envelope fa-fw"> </i></span>
                      <input
                        type="text"
                        name="email"
                        className="form-control"
                        placeholder="Email Address"
                        onChange={this.handleInputChange}
                        value={this.state.email}
                      />
                    </div>
                    <p style={inputError}>{this.state.emailError}</p>
                  </div>
                  <div className="form-group">
                    <div className="input-group">
                      <span className="input-group-addon"><i className="fa fa-key fa-fw"> </i></span>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        name="password"
                        onChange={this.handleInputChange}
                        value={this.state.password}
                      />
                    </div>
                    <p style={inputError}>{this.state.passwordError}</p>
                  </div>
                </form>
                <button className="btn btn-warning btn-block" onClick={this.handleLogin}>Login</button>
              </article>
            </section>
          </div>
        );
      }

    }

    class RestShortInfo extends React.Component {
      constructor(props) {
        super(props);
        this.toRestaurant = this.toRestaurant.bind(this);
        this.select = this.select.bind(this);
      }
      toRestaurant() {
        this.props.handleChangePage('Restaurant', this.props.rest.restId);
      }
      select() {
        if (this.props.selected) { // deselect
          this.props.handleChangeMapPos(0, 0, 0)
          this.props.handleChangeSelectedRest(undefined);
        }
        else {
          this.props.handleChangeMapPos(this.props.rest.longitude, this.props.rest.latitude, 20)
          this.props.handleChangeSelectedRest(this.props.rest);
        }

      }
      render() {
        const style = this.props.selected ? {width: '100%', backgroundColor: 'yellow'} : {width: '100%'}
        const moreInfo = <button className="btn btn-secondary" onClick={this.toRestaurant}>View More</button>
        return (
          <div className="btn" onClick={this.select} style={style}>
            <p>{this.props.rest.name}</p>
            <p>{this.props.rest.distance}M</p>
            <p>
              <img src="../images/view.png" style={{width: 25, height: 25}}/> &nbsp;
              {this.props.rest.views} &nbsp;
              <img src="../images/like.png" style={{width: 25, height: 25}}/> &nbsp;
              {this.props.rest.likes.length} &nbsp;
              <img src="../images/dislike.png" style={{width: 25, height: 25}}/> &nbsp;
              {this.props.rest.dislikes.length} &nbsp;
            </p>
            <p>
              {this.props.selected && moreInfo}
            </p>
          </div>
        );
      }
    }

    class ClosestRestaurant extends React.Component {
      constructor(props) {
        super(props);
        this.handleChangeSelectedRest = this.handleChangeSelectedRest.bind(this);
        this.getRestaurants = this.getRestaurants.bind(this);
        this.fetchKClosestRest = this.fetchKClosestRest.bind(this);
        this.fetchRest = this.fetchRest.bind(this);
        this.setPos = this.setPos.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.filterRestaurant = this.filterRestaurant.bind(this);
        this.state = {
          pos: '',
          isLoading: true,
          k: props.k,
          isBackgroundLoading: false,
          selectedRest: undefined,
          restaurants: '',
          filteredRestaurant: '',
          searchBarValue: ''
        };

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(this.setPos,this.fetchRest);
        }
        else {
          this.fetchRest();
        }
      }

      setPos(pos) {
        this.setState({pos: pos})
        this.fetchKClosestRest();
      }

      fetchRest() {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        const url = `${this.props.URL}/restaurant`

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {

              if (data.response == 'success') {
                  this.setState({restaurants: data.restaurants}, () => {
                    this.setState({
                      filteredRestaurants: this.filterRestaurant(this.state.searchBarValue),
                      isLoading: false,
                      isBackgroundLoading: false
                    })
                  });
              }
            });
      }

      fetchKClosestRest() {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        const url = `${this.props.URL}/closest_restaurants/${this.state.k}/${this.state.pos.coords.latitude}/${this.state.pos.coords.longitude}`

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {

              if (data.response == 'success') {
                  this.setState({restaurants: data.restaurants}, () => {
                    this.setState({
                      filteredRestaurants: this.filterRestaurant(this.state.searchBarValue),
                      isLoading: false,
                      isBackgroundLoading: false
                    })
                  });
              }
            });
      }
      filterRestaurant(searchText){
        return this.state.restaurants
          .filter(restaurants => {
            if(restaurants.name.toLowerCase().includes(
              searchText.toLowerCase())
            ){
              return true;
            }
            return false;
          });
      }
      handleSearchChange = event => {
        this.setState({
          searchBarValue: event.target.value
        });
        if(event.target.value != ''){
          this.setState({k: Number.MAX_VALUE, isBackgroundLoading: true}, () => {
            if(this.state.pos != '')
              this.fetchKClosestRest();
            this.setState({
              filteredRestaurants: this.filterRestaurant(this.state.searchBarValue),
              isLoading: false,
              isBackgroundLoading: false
            })
          });
        }else{
          this.setState({k: this.props.k, isBackgroundLoading: true}, () => {
            if(this.state.pos != '')
              this.fetchKClosestRest();
            this.setState({
              filteredRestaurants: this.filterRestaurant(this.state.searchBarValue),
              isLoading: false,
              isBackgroundLoading: false
            })
          });
        }
        document.getElementsByClassName("table-responsive")[0].scrollTo(0, 0);
      }

      handleChangeSelectedRest(rest) {
        this.setState({selectedRest: rest})
      }

      getRestaurants() {
        var restaurants = []

        for (let i = 0; i < this.state.filteredRestaurants.length; i++) {
          restaurants.push((
            <tr>
              <td>
                <RestShortInfo  rest={this.state.filteredRestaurants[i]}
                                handleChangePage={this.props.handleChangePage}
                                handleChangeMapPos={this.props.handleChangeMapPos}
                                handleChangeSelectedRest={this.handleChangeSelectedRest}
                                selected={this.state.selectedRest && this.state.selectedRest.restId == this.state.filteredRestaurants[i].restId}
                />
              </td>
            </tr>
          ));
        }

        return restaurants
      }

      loadMore(e) {
        var obj = e.target

        if (obj.scrollTop + obj.clientHeight >= obj.scrollHeight-10 && !this.state.isBackgroundLoading && this.state.pos != '') {
          this.setState({k: this.state.k+3, isBackgroundLoading: true}, () => {
            this.fetchKClosestRest();
          });
        }
      }

      render() {
        if (this.state.isLoading) {
          return (
            <section className="col-sm col-md-5 col-lg-4 card p-3 mt-3">
              <h4 className="text-left px-4 ">Closest Restaurant</h4>
              <input className="form-control" value={this.state.searchBarValue} onChange={this.handleSearchChange} type="search" placeholder="Search" aria-label="Search"/>
              <img src="../images/loading.gif" style={{width: 300, height: 300}}/>
            </section>
          );
        }
        else if (this.state.searchBarValue != '' && this.state.filteredRestaurants.length == 0) {
          return (
            <section className="col-sm col-md-5 col-lg-4 card p-3 mt-3">
              <h4 className="text-left px-4 ">Closest Restaurant</h4>
              <input className="form-control" value={this.state.searchBarValue} onChange={this.handleSearchChange} type="search" placeholder="Search" aria-label="Search"/>
              <p>No Result Found</p>
            </section>
          );
        }
        else {
          return (
            <section id="closet-restaurant" className="col-sm col-md-5 col-lg-4 card p-3 mt-3">
              <h4 className="text-left px-4 ">Closest Restaurant</h4>
              <input className="form-control" value={this.state.searchBarValue} onChange={this.handleSearchChange} type="search" placeholder="Search" aria-label="Search"/>
              <div className="table-responsive" style={{maxHeight: 400, overflow: 'scroll'}} onScroll={this.loadMore}>
                <table id="table-closest-restaurant" className="table table-striped table-bordered table-hover mt-4">
                {this.getRestaurants()}
                </table>
                {this.state.searchBarValue == '' && this.state.isBackgroundLoading && <img src="../images/loading2.gif" style={{width: 50, height: 50}}/>}
              </div>
            </section>
          );
        }
      }
    }

    class MapItem extends React.Component {
      constructor(props) {
        super(props);
      }

      render() {
        return (
          <section id="map" className="col-sm col-md-7 col-lg-8 card p-3 mt-3">
            <iframe src={`map.html?lat=${this.props.lat}&lon=${this.props.lon}&zoom=${this.props.zoom}`} height={350}>

            </iframe>
            <a href="map.html"> Detailed Map (beta version)</a>
          </section>
        );
      }
    }

    class Home extends React.Component {
      constructor(props) {
        super(props)
        this.state = {lon: 0, lat: 0, zoom: 0}
        this.handleChangeMapPos = this.handleChangeMapPos.bind(this);
        window.history.replaceState({page: 'Home'}, null, `?page=home`);
      }

      handleChangeMapPos(longitude, latitude, zoom) {
        this.setState({lon: longitude, lat: latitude, zoom: zoom})
      }

      render() {
        return (
            <div className="row">
              <MapItem  lat={this.state.lat}
                        lon={this.state.lon}
                        zoom={this.state.zoom}
              />
              <ClosestRestaurant URL={this.props.URL}
                                  k={5}
                                  handleChangePage={this.props.handleChangePage}
                                  handleChangeMapPos={this.handleChangeMapPos}
              />
            </div>
          );
      }
    }

    class Admin extends React.Component {
      constructor(props) {
        super(props)

        window.history.replaceState({page: 'Admin'}, null, `?page=admin`);
      }

      render() {
        return (
            <div className="row">


            </div>
          );
      }
    }

    function Footer() {
      return (
        <footer className="text-center card mt-3">
          <p>Created by: Group15</p>
        </footer>
      );
    }

    class Profile extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          password: '',
          againPassword: '',
          passwordError: '',
          againPasswordError: '',
          changeResult: ''
        };
        window.history.pushState({page: 'Profile'}, null, `?page=profile`);
        this.cancel = this.cancel.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.generateError = this.generateError.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.ClickChangePassword = this.ClickChangePassword.bind(this);
        this.handleChangeIcon = this.handleChangeIcon.bind(this);
      }

      componentDidMount() {
        // Hide change password form
        $(".form2").hide();
      }

      ClickChangePassword() {
        $("#changePasswordForm").fadeIn();
      }

      cancel() {
        $("#changePasswordForm").slideUp();
        $("#newPassword").val('');
        $("#newRePassword").val('');
      }

      handleChangePassword() {
        console.log(this.props.token)
        var hasError = this.generateError();
        var password = this.state.password;
        if (hasError == false){
          if (password != null && password != '') {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'authorization': this.props.token },
                body: JSON.stringify({ password: password })
            };

            fetch(this.props.URL + '/password/', requestOptions)
                .then(response => response.json())
                .then(data => {
                  if (data.response == 'success') {
                      toastada.success('You have successfully changed your password');
                      this.props.reloadUser();

                  }
                  else {
                      toastada.error('Failed: ' + data.message)
                  }
                });
            this.cancel();
          }
        }
      }

      generateError() {
        let hasError = false;

        if (this.state.password != this.state.againPassword) {
          this.setState({
            passwordError: 'Two passwords must be equal.',
            againPasswordError: 'Two passwords must be equal.'
          });
          hasError = true;
        }
        else if (this.state.password == '') {
          this.setState({
            passwordError: 'Password cannot be empty.',
            againPasswordError: 'Password cannot be empty.'
          });
          hasError = true;
        }
        else {
          this.setState({
            passwordError: '',
            againPasswordError: ''
          });
        }

        return hasError;
      }

      handleInputChange(e){
          const target = e.target;
          const value = target.type === 'checkbox' ? target.checked : target.value;
          const name = target.name;
          this.setState({
              [name]: value
          });
      }

      handleChangeIcon() {
        var iconUrl = prompt('Please enter the image url of your icon');

        if (iconUrl != null && iconUrl != '') {
          // Simple POST request with a JSON body using fetch
          const requestOptions = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'authorization': this.props.token },
              body: JSON.stringify({  iconUrl: iconUrl })
          };

          fetch(this.props.URL + '/icon/', requestOptions)
              .then(response => response.json())
              .then(data => {
                if (data.response == 'success') {
                    toastada.success('You have successfully updated your icon');
                    this.props.reloadUser();

                }
                else {
                    toastada.error('Failed: ' + data.message)
                }
              });
        }

      }

      render() {
        if (this.props.user != null) {
          let inputError = {
            fontSize: 'small',
            color: 'red',
            paddingLeft: '20px'
          };
          return (
            <div className="mt-3">
              <div className="card px-4 pt-3">
                <center>
                <img src={this.props.user.iconUrl} style={{width: '150', height: '150', borderRadius: '50%', objectFit: 'cover'}} />
                <h1>{this.props.user.name}</h1>
                <p className="title">({this.props.user.type})</p>
                <p>{this.props.user.email}</p>
                <p>Join Date: {this.props.user.joinDate}</p>
                </center>

                <p><button type="submit" className="btn btn-warning btn-block" onClick={this.ClickChangePassword}>Change Password</button></p>

                    <center>
                  <div className="form2 col-8" id="changePasswordForm">
                    <section id="inner-wrapper" className="mb-2 mt-2">
                      <article>
                        <form id="passwordChangeForm">
                          <div className="form-group">
                            <div className="input-group">
                              <input
                                id="newPassword"
                                type="password"
                                className="form-control"
                                placeholder="New Password"
                                name="password"
                                onChange={this.handleInputChange}
                                value={this.state.password}
                              />
                            </div>
                            <p style={inputError}>{this.state.againPasswordError}</p>
                          </div>
                          <div className="form-group">
                            <div className="input-group">
                              <input
                                id="newRePassword"
                                type="password"
                                name="againPassword"
                                className="form-control"
                                placeholder="Enter New Password Again"
                                onChange={this.handleInputChange}
                                value={this.state.againPassword}
                              />
                            </div>
                            <p style={inputError}>{this.state.passwordError}</p>
                          </div>
                        </form>
                        <div>
                            <button className="btn btn-sm btn-outline-dark float-left mb-3" onClick={this.cancel}>Cancel</button>
                            <button className="btn btn-outline-success btn-sm float-right mb-3" onClick={this.handleChangePassword}>Submit</button>
                        </div>
                        <p style={this.state.changeResultStyle}>{this.state.changeResult}</p>
                      </article>
                    </section>
                  </div>
                  </center>
              <p><button type="submit" className="btn btn-warning btn-block" onClick={this.handleChangeIcon}>Change Icon</button></p>
              </div>
              </div>
          );
        }
        else {
          return (
            <img src="../images/loading.gif" style={{width: 300, height: 300}}/>
          );
        }
      }
    }

    class CommentInput extends React.Component {

      constructor(props) {
        super(props)
        this.state = {content: ''}
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handlePostComment = this.handlePostComment.bind(this)
      }

      handlePostComment() {
        // Simple POST request with a JSON body using fetch
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'authorization': this.props.token },
            body: JSON.stringify({  content: this.state.content })
        };
        fetch(this.props.URL + '/comment/' + this.props.restId, requestOptions)
            .then(response => response.json())
            .then(data => {
              if (data.response == 'success') {
                  toastada.success('You have successfully left a comment!');
                  this.setState({content: ''});
                  this.props.reloadComment();
              }
              else {
                  toastada.error('Failed: ' + data.message)
              }
            });

      }

      handleInputChange(e){
          const target = e.target;
          const value = target.type === 'checkbox' ? target.checked : target.value;
          const name = target.name;
          this.setState({
              [name]: value
          });
      }

      render() {
        return (
          <div className={"message"}>
            <div style={{display: 'flex'}}>
            <img src={this.props.user.iconUrl} alt="Avatar"/>
            <textarea
              placeholder={`Commenting publicly as ${this.props.user.name}`}
              name="content"
              style={{flexGrow: 100, resize: 'none'}}
              value={this.state.content}
              onChange={this.handleInputChange}
            />
            </div>
            <br />
            <button className="btn btn-warning" style={{float: 'right'}} onClick={this.handlePostComment}>COMMENT</button>
          </div>
        );
      }
    }

    function Comment(props) {
      const timeSince = (date) =>  {
          var seconds = Math.floor((new Date() - date) / 1000);

          var interval = Math.floor(seconds / 31536000);

          if (interval >= 1) {
            return interval + " years ago";
          }
          interval = Math.floor(seconds / 2592000);
          if (interval >= 1) {
            return interval + " months ago";
          }
          interval = Math.floor(seconds / 86400);
          if (interval >= 1) {
            return interval + " days ago";
          }
          interval = Math.floor(seconds / 3600);
          if (interval >= 1) {
            return interval + " hours ago";
          }
          interval = Math.floor(seconds / 60);
          if (interval >= 1) {
            return interval + " minutes ago";
          }
          return Math.floor(seconds) + " seconds ago";
      }

      if (props.user) {
        return (
          <div className={"message"}>
            <img src={props.user.iconUrl} alt="Avatar" />
            <span className="name">{props.user.name}</span> &nbsp;
            <span style={{color: '#9b870c'}}>({props.user.type})</span> &nbsp;
            <span className="time">{timeSince(Date.parse(props.time))}</span>
            <p>
              {props.content}
            </p>
          </div>
        );
      } else {
        return(
          <div className={"message"}>
            <img src={"https://image.flaticon.com/icons/svg/21/21104.svg"} alt="Avatar" />
            <p style={{fontStyle: 'italic'}}>
              {'This user has been deleted/deactivated. Press "F" to pay respects.'}
            </p>
          </div>
        );
      }
    }

    class Restaurant extends React.Component {
      constructor(props) {
        super(props);

        const requestOptions = {
            method: 'GET'
        };

        this.state = {rest: null, liveReload: true}

        // Add 1 More View
        fetch(props.URL + '/view/restaurant/' + props.restId, requestOptions)
          .then(response => response.json())
          .then(data => {
            // Get Restaurant Object
            fetch(props.URL + '/restaurant/' + props.restId, requestOptions)
              .then(response => response.json())
              .then(data => {
                this.setState({rest: data.restaurant[0]})
              });
          });


        window.history.pushState({page: 'Restaurant'}, null, `?page=restaurant&restId=${props.restId}`);

        this.handleLike = this.handleLike.bind(this)

        this.handleDislike = this.handleDislike.bind(this)

        this.reloadRest = this.reloadRest.bind(this)

        this.reloadComment = this.reloadComment.bind(this)
      }

      componentDidMount() {
        setInterval(this.reloadComment, 1500);
      }

      reloadComment() {
        // Reload Restaurant Object
        var _this = this;
        if (this.state.liveReload) {
          const requestOptions = {
              method: 'GET'
          };
          fetch(this.props.URL + '/restaurant/' + this.state.rest.restId, requestOptions)
            .then(response => response.json())
            .then(data => {
              if (data.restaurant[0].comments.length != this.state.rest.comments.length) {
                  this.setState({rest: data.restaurant[0]})
              }
            }).catch(function(err) {_this.setState({liveReload: false})});
        }
      }

      reloadRest() {
        // Reload Restaurant Object
        const requestOptions = {
            method: 'GET'
        };
        fetch(this.props.URL + '/restaurant/' + this.state.rest.restId, requestOptions)
          .then(response => response.json())
          .then(data => {
            this.setState({rest: data.restaurant[0]})
          });
      }

      handleDislike() {
        // Dislike the restaurant
        const requestOptions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'authorization': this.props.token }
        };

        fetch(this.props.URL + '/dislike/' + this.state.rest.restId, requestOptions)
          .then(response => response.json())
          .then(data => {
            if (data.message == 'you have already rated this restaurant'){
                toastada.warning(data.message);
            }
            else if (data.response == 'fail') {
                toastada.error('Failed. You must login before rating');
            }
            else {
                this.reloadRest();
            }
          });
      }

      handleLike() {
        // Like the restaurant
        const requestOptions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'authorization': this.props.token }
        };
        fetch(this.props.URL + '/like/' + this.state.rest.restId, requestOptions)
          .then(response => response.json())
          .then(data => {
            if (data.message == 'you have already rated this restaurant'){
                toastada.warning(data.message);
            }
            else if (data.response == 'fail') {
                toastada.error('Failed. You must login before rating');
            }
            else {
                this.reloadRest();
            }
          });
      }

      getComments() {
        let comments = [];
        let n = this.state.rest.comments.length;

        const sorted = this.state.rest.comments.reverse();

        for (let i = 0; i < n; i++) {
            comments.push(
              (<Comment user={sorted[i].postBy}
                        content={sorted[i].content}
                        time={sorted[i].time}
                        reloadComment={this.reloadComment}/>)
            );
        }

        return comments;
      }

      render() {
        if (this.state.rest == null) {
          return (
            <img src="../images/loading.gif" style={{width: 300, height: 300}}/>
          );
        }
        else {
          const liked = this.props.user && this.state.rest.likes.indexOf(this.props.user._id) != -1;
          const disliked = this.props.user && this.state.rest.dislikes.indexOf(this.props.user._id) != -1;
          const likeImg = liked ? "../images/liked.png" : "../images/like.png"
          const dislikeImg = disliked ? "../images/disliked.png" : "../images/dislike.png"
          const mapUrl = `https://maps.google.com/maps?q=${this.state.rest.latitude},${this.state.rest.longitude}&z=14&output=embed`;
          const commentInput = (
              <CommentInput user={this.props.user}
                            restId={this.state.rest.restId}
                            token={this.props.token}
                            URL={this.props.URL}
                            reloadComment={this.reloadComment}
              />
          )
          return (
            <div>
              <div className="row mt-3">
                <div className="col-12 col-sm-6 col-md-8"><h2>{this.state.rest.name}</h2></div>
                <div className="col-6 col-md-4">
                  <div className="float-right">
                    <img src="../images/view.png" style={{width: 30, height: 40, paddingBottom: 10}}/> &nbsp;
                    {this.state.rest.views} &nbsp; &nbsp;
                    <input type="image" src={likeImg} style={{width: 20, height: 20}} onClick={this.handleLike}/> &nbsp;
                    {this.state.rest.likes.length} &nbsp; &nbsp;
                    <input type="image" src={dislikeImg} style={{width: 20, height: 20}} onClick={this.handleDislike}/> &nbsp;
                    {this.state.rest.dislikes.length} &nbsp; &nbsp;
                  </div>

                </div>
              </div>

            <iframe scrolling="no" marginHeight={0} marginWidth={0} src={mapUrl} width={'100%'} height={300} frameBorder={0}>
            </iframe>
              <hr />
              <div className="text-secondary" dangerouslySetInnerHTML={{ __html: this.state.rest.description }} />
              <hr />
              <h5>{this.state.rest.comments.length} Comments</h5>
              {this.props.user && commentInput}
              {this.getComments()}
            </div>
          );
        }
      }


    }

    class Content extends React.Component {
      constructor(props) {
        super(props);
	  this.getPage = this.getPage.bind(this);
      }

      getPage() {

        if (this.props.page.toLowerCase() == 'home') {
          return (<Home URL={this.props.URL} handleChangePage={this.props.handleChangePage}/>);
        }
        else if (this.props.page.toLowerCase() == 'profile') {
          return (<Profile user={this.props.user} URL={this.props.URL} token={this.props.token} reloadUser={this.props.reloadUser}
                        handlePopupMsg={this.handlePopupMsg}/>);
        }
        else if (this.props.page.toLowerCase() == 'restaurant') {
          return (<Restaurant restId={this.props.parameter} token={this.props.token} URL={this.props.URL} user={this.props.user}/>);
        }
        else if (this.props.page.toLowerCase() == 'manageuser') {
          return (<ManageUser token={this.props.token} URL={this.props.URL}  handleChangePage={this.props.handleChangePage}/>);
        }
        else if (this.props.page.toLowerCase() == 'managerest') {
          return (<ManageRest token={this.props.token} URL={this.props.URL} />);
        }
        else {
          return (<div></div>);
        }

      }

      render() {
        return (
          <div className="container">
            {this.getPage()}
            <Footer />
          </div>
        );
      }

    }

    class Popup extends React.Component {
      constructor(props) {
        super(props);
        this.state = {};
      }
      componentWillReceiveProps(nextProps) {
        $('#myModal').on('hidden.bs.modal', function () {
          nextProps.handlePopupMsg(''); // change the pop message to empty when dismiss
        })
      }
      componentDidMount() {
        $("#myModal").modal('show');
      }
      render() {
        if (this.props.msg) {
          return (
            <div className="modal fade" id="myModal" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <img src="../images/email-banner.jpg" className="img-fluid" style={{height: '175px', width: '100%'}}/>
                  </div>
                  <div className="modal-body">
                    <p>{this.props.msg}</p>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        else {
          return (<div></div>);
        }
      }
    }

    class ManageUser extends React.Component {

      constructor(props) {
        super(props);
        this.state = { data: [] };
        window.history.pushState({page: 'ManageUser'}, null, `?page=manageuser`);
        this.handleDelete = this.handleDelete.bind(this);
        this.getUsers = this.getUsers.bind(this);
        const requestOptions = {method: 'GET'};
        fetch(this.props.URL + '/users', requestOptions)
          .then(data => data.json())
          .then((data) => {
            this.setState({
                data: data
            })
          });
      }

      getUsers() {
        let user_list = this.state.data;
        return user_list.map((user) =>
          <tr>
            <td>{user.userId}</td>
            <td>{user.type}</td>
            <td>{user.email}</td>
            <td>{user.name}</td>
            <td>{user.joinDate}</td>
            <td>
                <button
                  className="btn btn-block"
                  value={user.userId}
                  onClick={() => { if(window.confirm('Are you sure to delete?')) this.handleDelete(user.userId) }}>
                  <i className="fa fa-trash-o" style={{color: "red"}} > </i>
                </button>
            </td>
          </tr>
        );
      }

      handleDelete(id) {
        var userId = id;
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        };

        fetch(this.props.URL + '/user/' + userId, requestOptions)
            .then(response => response.json())
            .then(data => {
              if (data.response == 'success') {
                  toastada.success('You have successfully deleted a user!');
                  this.setSate({data: data});
              }
              else {
                  toastada.error('Failed: ' + data.message)
              }
            });
        window.location.reload();
      }

      render() {
        return(
          <div>
            <h3>Manage Users</h3>
            <div id="userlist" className="table-responsive">
              <table className="table table-striped table-bordered table-hover">
                <tr><th>User ID</th><th>User Type</th><th>Email</th><th>Name</th><th>Join Date</th><th></th></tr>
              {this.getUsers()}
              </table>
              </div>
          </div>
        );
      }
    }

    class ManageRest extends React.Component {

      constructor(props) {
        super(props);
        this.state = {
          data: [],
          name: '',
          tag: '',
          longitude: '',
          latitude: '',
          description: ''
        };
        window.history.pushState({page: 'ManageRest'}, null, `?page=managerest`);
        this.handleDelete = this.handleDelete.bind(this);
        this.getRests = this.getRests.bind(this);
        this.getForm = this.getForm.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

        const url = this.props.URL + '/rests';
        const requestOptions = {method: 'GET'};
        fetch(url, requestOptions)
          .then(data => data.json())
          .then((data) => {
            this.setState({
                data: data
            })
          });
      }

      handleInputChange(e){
          const target = e.target;
          const value = target.type === 'checkbox' ? target.checked : target.value;
          const name = target.name;
          this.setState({
              [name]: value
          });
      }

      getForm() {
        return <div id="newRestTab" className="">
                <form>
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span class="input-group-text">Name</span>
                      </div>
                      <input
                        id="restName"
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Enter restaurant name"
                        onChange={this.handleInputChange}
                        value={this.state.name}
                      />
                    </div>
                </form>
              </div>
      }

      getRests() {
        return this.state.data.map((rest) =>
          <tr>
            <td>{rest.restId}</td>
            <td>{rest.name}</td>
            <td>{rest.tag}</td>
            <td>{rest.likes.length}</td>
            <td>{rest.dislikes.length}</td>
            <td>{rest.views}</td>
            <td>{rest.comments.length}</td>
            <td>
                <button
                  className="btn btn-block"
                  value={rest.restId}
                  onClick={() => { if(window.confirm('Are you sure to delete?')) this.handleDelete(rest.restId) }}>
                  <i className="fa fa-trash-o" style={{color: "red"}} > </i>
                </button>
            </td>
          </tr>
        );
      }

      handleDelete(id) {
        var restId = id;
        const url = this.props.URL + '/rest/' + restId;
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {
              if (data.response == 'success') {
                  toastada.success('You have successfully deleted a restaurant!');
                  this.setSate({data: data});
              }
              else {
                  toastada.error('Failed: ' + data.message)
              }
            });
        window.location.reload();
      }

      render() {
        return(
          <div>
            <h3>Manage Restaurant</h3>
            <div id="restlist" className="table-responsive">
              <table className="table table-striped table-bordered table-hover">
                <tr><th>ID</th><th>Name</th><th>Tag</th><th>Likes</th><th>Dislikes</th><th>Views</th><th>Comments</th><th></th></tr>
              {this.getRests()}
              </table>
              </div>
          </div>
        );
      }
    }

    class App extends React.Component {
      componentDidMount() {
          window.onpopstate = this.onBackOrForwardButtonEvent;
          if (Cookies.get('token'))
            this.handleChangeToken(Cookies.get('token'));
      }

      onBackOrForwardButtonEvent = (e) => {
          e.preventDefault();
          this.setState({
            page: e.state.page
          });
      };

      getPageFromUrl() {
        var url_string = window.location.href;
        var url = new URL(url_string);
        if (url.searchParams.get("page") != null)
          return url.searchParams.get("page");
        else
          return "home";
      }

      getParameterFromUrl() {
        var url_string = window.location.href;
        var url = new URL(url_string);
        if (url.searchParams.get("restId") != null)
          return url.searchParams.get("restId");
        else
          return "";
      }

      constructor(props) {
        super(props);
        this.state = {
          page: this.getPageFromUrl(),
          status: 'Not connected to the backend server',
          token: '',
          username: '',
          userType: '',
		      mask: false,
          popupMsg: '',
          toParameter: this.getParameterFromUrl(),
          user: null
        };
	      this.handleToggleMask = this.handleToggleMask.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeToken = this.handleChangeToken.bind(this);
        this.handlePopupMsg = this.handlePopupMsg.bind(this);
        this.loadProfile = this.loadProfile.bind(this);
        this.reloadUser = this.reloadUser.bind(this);
        this.callAPI();
      }

      reloadUser() {
        const token = this.state.token;
        if (token != '') {
          const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'authorization': token }
          };

          fetch(this.props.URL + '/profile', requestOptions)
            .then(response => response.json())
            .then(user => {
              this.setState({username: user.name, userType: user.type});
			        this.setState({user: user});
            });
        }
        else {
          this.setState({user: null});
        }
      }

      loadProfile(token) {
        this.setState({username: ''}); // logout first

        if (token != '') {

          const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'authorization': token }
          };

          fetch(this.props.URL + '/profile', requestOptions)
            .then(response => response.json())
            .then(user => {
              this.setState({username: user.name, userType: user.type});
			        this.setState({user: user});
            });
        }
        else {
          this.setState({user: null});
        }
      }

      callAPI() {
        fetch(this.props.URL)
          .then(response => response.json())
          .then(data => {
            this.setState({
              status: data['response']
            });
          });
      }

      handleChangePage(to, parameter) {
        window.history.pushState({page: this.state.page}, null, "");
        this.setState({page: to});
        if (parameter)
          this.setState({toParameter: parameter})
      }

      handleChangeToken(token) {
        Cookies.set('token', token, { expires: 7 })
        this.setState({token: token});
        this.loadProfile(token);
      }

      handlePopupMsg(msg) {
        this.setState({popupMsg: msg});
      }

  		handleToggleMask() {
  		  this.setState({mask: !this.state.mask});
  		}

      render() {
	      const mask = (<span className="mask" onClick={this.handleToggleMask}></span>);
        const popup = (<Popup msg={this.state.popupMsg} handlePopupMsg={this.handlePopupMsg}/>);

        return (
          <div>
            <Header />
            <Nav  username={this.state.username}
                  userType={this.state.userType}
                  ref={(element) => {window.helloComponent = element}}
                  handleChangePage={this.handleChangePage}
                  handleChangeToken={this.handleChangeToken}
				handleToggleMask={this.handleToggleMask}
            />
            <Content 	page={this.state.page}
					user={this.state.user}
          handleChangePage={this.handleChangePage}
                  handleChangeToken={this.handleChangeToken}
          parameter={this.state.toParameter}
          URL={this.props.URL}
          token={this.state.token}
          reloadUser={this.reloadUser}
		  />
            <LoginForm  URL={this.props.URL}
                        handleChangeToken={this.handleChangeToken}
                        handlePopupMsg={this.handlePopupMsg}
					  handleToggleMask={this.handleToggleMask}
            />
            <RegisterForm URL={this.props.URL}
                        handleChangeToken={this.handleChangeToken}
                        handlePopupMsg={this.handlePopupMsg}
					  handleToggleMask={this.handleToggleMask}
            />
		        {this.state.mask && mask}
            {this.state.popupMsg != '' && popup}
          </div>
        );
      }
    }

    ReactDOM.render(<App URL={location.protocol + '//' + location.host}/>, document.getElementById('root'));