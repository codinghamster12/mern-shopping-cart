import React, { Component } from "react";
import "../css/styles.css";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import axios from "axios";
import Cart from "./cart1.component";

export default class BookDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      book: [],
      modal: false,
      cover: ""
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:4000/books/" + this.props.match.params.id)
      .then(response => {
        this.setState({ book: response.data, cover: response.data.cover });
      })
      .catch(function(err) {
        console.log(err);
      });
  }
  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  AddToCart = e => {
    const { book } = this.state;
    let id = book._id;
    let cover = book.cover;
    let price = book.price;
    let qty = 1;
    let product = { id: id, cover: cover, price: price, qty: qty };
    let existing = JSON.parse(sessionStorage.getItem("cart"));
    existing = existing ? existing : [];
    let val = existing.filter(item => item.id === id);
    if (existing.length !== 0) {
      if (val.length != 0) {
        existing.forEach(item => {
          if (item.id === id) {
            item.qty++;
          }
        });
      } else {
        existing.push(product);
      }
    } else {
      existing.push(product);
    }

    sessionStorage.setItem("cart", JSON.stringify(existing));
  };
  getImages = cover => {
    let imagesURL = [
      "./images/csharp.jpg",
      "./images/css.jpg",
      "./images/javascript.jpg",
      "./images/json.jpg",
      "./images/lpthw.jpg",
      "./images/mongodb.jpg",
      "./images/node.jpg",
      "./images/php.jpg",
      "./images/python.jpg",
      "./images/sql.jpg"
    ];

    const bookUrl = `./images/${cover}`;
    let coverUrl = "./images/nocover.jpg";
    imagesURL.forEach(url => {
      if (url == bookUrl) {
        coverUrl = bookUrl;
      }
    });

    return coverUrl;
  };

  render() {
    const { book, quantity } = this.state;
    let src = this.getImages(this.state.cover);
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-6">
            <img src={require("" + src)} width="350" height="500"></img>
          </div>
          <div className="col-sm-6">
            <h2>{book.title}</h2>
            <ul>
              <li>Category: {book.category}</li>
              <li>Author: {book.author}</li>
            </ul>
            <p className="button blue">${book.price}</p>
            <p>{book.description}</p>
            <button
              id={book._id}
              onClick={() => {
                this.toggle();
                this.AddToCart();
              }}
              className="btn btn-success"
            >
              Add to Cart
            </button>
            <Modal isOpen={this.state.modal} toggle={this.toggle}>
              <ModalHeader toggle={this.toggle}>My Cart</ModalHeader>
              <ModalBody>
                <Cart></Cart>
              </ModalBody>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}
