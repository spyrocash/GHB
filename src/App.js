import React, { Component } from 'react';
import { Form, Input, Button, Modal, Radio, Spin } from 'antd';
import FontAwesome from 'react-fontawesome';
import * as firebase from 'firebase';
import { Player } from 'video-react';
import _ from 'lodash';

import './App.css';

import logo from './images/logo.png';
import btnRule from './images/btn-rule.png';
import btnAward from './images/btn-award.png';
import btnFacebook from './images/btn-facebook.png';
import bgLabel from './images/bg-label.png';
import awardImg from './images/award.png';
import questionTopic from './images/question-topic.png';
import questionImage1 from './images/question-image1.png';
import questionImage2 from './images/question-image2.png';
import questionImage3 from './images/question-image3.png';
import rulesImage from './images/rules.png';
import awardText from './images/award-text.png';
import shareTopic from './images/share-topic.png';
import ansImage1 from './images/ans-1.png';
import ansImage2 from './images/ans-2.png';
import ansImage3 from './images/ans-3.png';
import ansImage4 from './images/ans-4.png';
import ansImage5 from './images/ans-5.png';
import btnFacebookShare from './images/btn-facebook-share.png';
import shareDescription from './images/share-description.png';

import videoFile from './video/1.mp4';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const firebaseConfig = {
  apiKey: 'AIzaSyAml5b6MuO4w41AFo_I6ob-EZRHsL4dcZc',
  authDomain: 'government-housing-bank.firebaseapp.com',
  databaseURL: 'https://government-housing-bank.firebaseio.com',
  storageBucket: 'government-housing-bank.appspot.com',
};
firebase.initializeApp(firebaseConfig);

class App extends Component {

  state = {
    registerPage: false,
    login: false,
    visibleRuleModal: false,
    visibleAwardModal: false,
    currentQuestion: 1,
    maxQuestion: 3,
    answer: Math.floor(Math.random() * 5) + 1,
    loading: true,
  }

  constructor(props) {
    super(props);
    this.init();
    this.checkLogin();
  }

  init = () => {
    const search = window.location.search;
    if (search !== '') {
      window.location.href = window.location.origin;
    }
  }

  setLogin = (isLogin) => {
    const { login, registerPage } = this.state;
    if (isLogin !== login) {
      this.setState({
        login: isLogin,
        registerPage: isLogin ? false : registerPage,
      });
    }
  }

  saveUser = (user, additionalUserInfo = {}) => {
    const data = {
      ...user.providerData[0],
      uid: user.uid,
      link: _.get(additionalUserInfo, 'profile.link'),
      gender: _.get(additionalUserInfo, 'profile.gender'),
    }
    fetch('/save.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });
  }

  getUser = () => {
    const user = firebase.auth().currentUser;
    return user;
  }

  checkLogin = () => {
    const _self = this;

    // firebase.auth().onAuthStateChanged(function(user) {
    //   if (user) {
    //     _self.setLogin(true);
    //   } else {
    //     _self.setLogin(false)
    //   }
    // });

    firebase.auth().getRedirectResult().then(function(result) {
      _self.setState({
        loading: false,
      });
      const user = result.user;
      if (user) {
        _self.saveUser(user, result.additionalUserInfo);
        _self.setLogin(true);
      }
    }).catch(function(error) {
      _self.setState({
        loading: false,
      });
      // const errorCode = error.code;
      const errorMessage = error.message;
      // const email = error.email;
      // const credential = error.credential;
      alert(errorMessage);
    });

  }

  login = (email, password) => {
    const _self = this;
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
      if (user) {
        _self.setLogin(true);
      }
    }).catch(function(error) {
      const errorMessage = error.message;
      if (errorMessage) {
        alert(errorMessage);
      }
    });
  }

  handleLoginSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const email = values.email;
        const password = values.password;
        this.login(email, password);
      }
    });
  }

  updateProfile = (displayName) => {
    const user = firebase.auth().currentUser;
    const _self = this;
    user.updateProfile({
      displayName,
    }).then(function() {
      _self.saveUser(user);
      _self.setLogin(true);
    }).catch(function(error) {
      const errorMessage = error.message;
      if (errorMessage) {
        alert(errorMessage);
      }
    });
  }

  register = (email, password, displayName) => {
    const _self = this;
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
      if (user) {
        _self.updateProfile(displayName);
      }
    }).catch(function(error) {
      const errorMessage = error.message;
      if (errorMessage) {
        alert(errorMessage);
      }
    });
  }

  handleRegisterSubmit = (e) => {
    e.preventDefault();
    const _self = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const email = values.regEmail;
        const password = values.regPassword;
        const displayName = values.regUserName;
        _self.register(email, password, displayName);
      }
    });
  }

  showRuleModal = () => {
    this.setState({
      visibleRuleModal: true,
    });
  }

  showAwardModal = () => {
    this.setState({
      visibleAwardModal: true,
    });
  }

  handleCancelRuleModal = (e) => {
    this.setState({
      visibleRuleModal: false,
    });
  }

  handleCancelAwardModal = (e) => {
    this.setState({
      visibleAwardModal: false,
    });
  }

  handleFacebokLogin = (e) => {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  }

  renderHomePage = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="warpper">
        <div className="login-warpper">
          <Form onSubmit={this.handleLoginSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator('email', {
                rules: [{ required: true, message: 'กรุณากรอกอีเมล!' }],
              })(
                <Input prefix={<FontAwesome name="user" />} placeholder="อีเมล" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'กรุณากรอกรหัสผ่าน!' }],
              })(
                <Input prefix={<FontAwesome name="lock" />} type="password" placeholder="รหัสผ่าน" />
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit" className="login-form-button">
                LOGIN
              </Button>
              <Button type="primary" className="register-form-button" onClick={this.goToRegisterPage}>
                REGISTER
              </Button>
            </FormItem>
          </Form>
          <div className="login-facebook">
            <a onClick={this.handleFacebokLogin}><img src={btnFacebook} alt="" /></a>
          </div> 
        </div>
        <div className="video-preview">
          <div className="video">
            <Player autoPlay={true}>
              <source src={videoFile} />
            </Player>
          </div>
          <div className="bg">
            <img src={bgLabel} alt="" />
          </div>
        </div>
      </div>
    );
  }

  onSelectQuestion = () => {
    const _self = this;
    const delayMillis = 500;
    setTimeout(function() {
      _self.setState({
        currentQuestion: _self.state.currentQuestion + 1,
      });
    }, delayMillis);
  }

  getQuestionHtml = (currentQuestion, image, title, list) => {
    return (
      <div className="question">
        <div className="topic">
          <img src={questionTopic} alt="" />
        </div>
        <div className="image">
          <img src={image} alt="" />
        </div>
        <div className="choice">
          <div className="title">{currentQuestion}.{title}</div>
          <div className="list">
            <RadioGroup onChange={this.onSelectQuestion} value="">
              {
                _.map(list, (value, key) => {
                  return (
                    <Radio key={_.toString(key)} value={key}>{value}</Radio>
                  );
                })
              }
            </RadioGroup>
          </div>
        </div>
      </div>
    );
  }

  getQuestion = (currentQuestion) => {
    const questions = [
      {
        image: questionImage1,
        title: 'คุณเป็นคนแบบไหน ?',
        list: ['เป็นคนรักธรรมชาติ', 'เป็นคนเงียบๆไม่ค่อยพูด รักความสงบ', 'เป็นคนติดเพื่อน รักการสังสรรค์'],
      },
      {
        image: questionImage2,
        title: 'สีแบบไหนที่โดนใจคุณ ?',
        list: ['ชอบสีสันสดใส เพราะชีวิตต้องการสีสัน', 'ขาว ดำ รักในความมินิมอล', 'ชอบสีไม้ ยังคงรักในความธรรมชาติ'],
      },
      {
        image: questionImage3,
        title: 'ชอบทำอะไรเวลาว่าง ?',
        list: ['ปลูกต้นไม้ รักโลก', 'ปาร์ตี้ริมสระน้ำ กับเพื่อนคู่ใจ', 'นั่งอ่านหนังสือ ดูซีรี่ส์'],
      },
    ];
    return questions[currentQuestion-1];
  }

  renderQuestion = (currentQuestion) => {
    const { image, title, list } = this.getQuestion(currentQuestion);
    const html = this.getQuestionHtml(currentQuestion, image, title, list);
    return html;
  }

  getAnswerHtml = (answer) => {
    let image = '';
    switch (answer) {
      case 1:
        image = ansImage1;
        break;
      case 2:
        image = ansImage2;
        break;
      case 3:
        image = ansImage3;
        break;
      case 4:
        image = ansImage4;
        break;
      case 5:
        image = ansImage5;
        break;
      default:
        image = ansImage1;
        break;
    }

    return (
      <div className="answer">
        <div className="topic"><img src={shareTopic} alt="" /></div>
        <div className="content"><img src={image} alt="" /></div>
        <div className="share-btn">
          <a href={`https://www.facebook.com/sharer.php?u=${window.location.origin}?answer=${answer}`} target="_blank"><img src={btnFacebookShare} alt="" /></a>
        </div>
        <div className="share-description"><img src={shareDescription} alt="" /></div>
      </div>
    );
  }

  renderAnswer = () => {
    const { answer } = this.state;
    return this.getAnswerHtml(answer);
  }

  goToRegisterPage = () => {
    this.props.form.resetFields();
    this.setState({ registerPage: true });
  }

  goToHomePage = () => {
    this.props.form.resetFields();
    this.setState({ registerPage: false });
  }

  renderRegisterPage = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="warpper">
        <div className="login-warpper register-warpper">
          <Form onSubmit={this.handleRegisterSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator('regUserName', {
                rules: [{ required: true, message: 'กรุณากรอกชื่อผู้ใช้!' }],
              })(
                <Input prefix={<FontAwesome name="user" />} placeholder="ชื่อผู้ใช้" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('regEmail', {
                rules: [{
                  type: 'email', message: 'อีเมลไม่ถูกต้อง!',
                }, {
                  required: true, message: 'กรุณากรอกอีเมล!',
                }],
              })(
                <Input prefix={<FontAwesome name="envelope" />} placeholder="อีเมล" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('regPassword', {
                rules: [{ required: true, message: 'กรุณากรอกรหัสผ่าน!' }],
              })(
                <Input prefix={<FontAwesome name="lock" />} type="password" placeholder="รหัสผ่าน" />
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit" className="register-form-button">
                REGISTER
              </Button>
            </FormItem>
          </Form>
          <div className="backhome">
            <Button type="primary" className="register-form-button" onClick={this.goToHomePage}>
              Back to home
            </Button>
          </div> 
        </div>
        <div className="video-preview">
          <div className="video">
            <Player autoPlay={true}>
              <source src={videoFile} />
            </Player>
          </div>
          <div className="bg">
            <img src={bgLabel} alt="" />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { login, visibleRuleModal, visibleAwardModal, currentQuestion, maxQuestion, registerPage, loading } = this.state;

    return (
      <Spin tip="Loading..." spinning={loading}>
        <div className="App">
          <div className="header"></div>
          <div className="logo">
            <img src={logo} alt="" />
          </div>
          <div className="main-content">
            {registerPage ? (
              this.renderRegisterPage()
            ) : (
              <div>
                {login ? (
                  <div>
                    {currentQuestion <= maxQuestion ? (
                      this.renderQuestion(currentQuestion)
                    ) : (
                      this.renderAnswer()
                    )}
                  </div>
                ) : (
                  this.renderHomePage()
                )}
              </div>
            )}
          </div>
          <div className="footer">
            <ul>
              <li><a onClick={this.showRuleModal}><img src={btnRule} alt="" /></a></li>
              <li><a onClick={this.showAwardModal}><img src={btnAward} alt="" /></a></li>
            </ul>
          </div>
          <Modal
            wrapClassName="rule-modal"
            title="กติกาและเงื่อนไข"
            visible={visibleRuleModal}
            onCancel={this.handleCancelRuleModal}
            footer={null}
          >
            <div>
              <img src={rulesImage} alt="" />
            </div>
          </Modal>
          <Modal
            wrapClassName="award-modal"
            title="รางวัล"
            visible={visibleAwardModal}
            onCancel={this.handleCancelAwardModal}
            footer={null}
          >
            <div className="content">
              <div className="image">
                <img src={awardImg} alt="" />
              </div>
              <div>
                <img src={awardText} alt="" />
              </div>
            </div>
          </Modal>
        </div>
      </Spin>
    );
  }
}

export default Form.create()(App);
