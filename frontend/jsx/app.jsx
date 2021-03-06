/*
  class App:
  This class is the main entry of the whole web app.
*/
    class App extends React.Component {
      // Send token to server for automatic login
      componentDidMount() {
          window.onpopstate = this.onBackOrForwardButtonEvent;
          if (Cookies.get('token'))
            this.handleChangeToken(Cookies.get('token'));
          $(".form").hide();
      }
      // History api: back and forward button to support single page in-app push and pop
      onBackOrForwardButtonEvent = (e) => {
          e.preventDefault();
          this.setState({
            page: e.state.page
          });
      };
      // Get in app current page title
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
        this.loadFavRest = this.loadFavRest.bind(this);
        this.reloadUser = this.reloadUser.bind(this);
        this.callAPI();
      }
      // Get user profile from server, and reload user content
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
      // Load user profile from server after logout
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
      // Load list of favourite restaurant of user from server
      loadFavRest(token) {
        this.setState({username: ''}); // logout first

        if (token != '') {

          const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'authorization': token }
          };

          fetch(this.props.URL + '/favourite', requestOptions)
            .then(response => response.json())
            .then(user => {
              //this.setState({username: user.name, userType: user.type});
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
      // History api: handle change page and push previous page to history
      handleChangePage(to, parameter) {
        window.history.pushState({page: this.state.page}, null, "");
        this.setState({page: to});
        if (parameter)
          this.setState({toParameter: parameter})
      }
      // Set new login token and load user's profile from server
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
      /*
      Render:
        1. Header
        2. Nav bar
        3. Content
        Default hidden register form, login form and popup message 
      */
      render() {
        const mask = (<span className="mask" onClick={this.handleToggleMask}></span>);
        const popup = (<Popup msg={this.state.popupMsg} handlePopupMsg={this.handlePopupMsg}/>);

        return (
          <div>
            <Header />
            <Nav  username={this.state.username}
                  userType={this.state.userType}
                  iconUrl={this.state.user ? this.state.user.iconUrl : ''}
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
