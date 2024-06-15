import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

function Pics() {
  //change loading pics and uploading pics into componets, beaucse i removed removing the pics container
  //dyanmical added photos hav an alt issue

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [submitPicPage, setSubmitPicPage] = useState("hidden");
  const [pictureContainer, setPictureContainer] = useState(true);
  const [postContainer, setPostContainer] = useState(false);

  const [inputText, setInputText] = useState("");
  const [file, setFile] = useState(null);
  const [likeButtonVisible, setLikeButtonVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [images, setImages] = useState({});

  const [imageCount, setImageCount] = useState(0);

  //makes it that data is only loaded once

  useEffect(() => {
    load();
  }, [user]);

  //loads all the pictures from the database

  async function load() {
    const account = {
      user: user,
    };
    const response = await fetch("/load", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(account),
    });

    const data = await response.json();
    setImageCount(data.url.length);
    if (data.url.length > 0) {
      for (var i = 0; i < data.url.length; i++) {
        setImages({ src: data.url[i], alt: data.url[i] });
        addPicture(i, data.url[i], data.text[i]);
      }
    }
  }

  //CHANGE THE 5, MAKE IT DYNAMIC
  const backButton = (i) => {
    i = i - 1;
    if (i < 0) {
      i = imageCount - 1;
    }
    console.log("i", i);
    openPicture(i);
  };

  const frontButton = (i) => {
    console.log("clicked front button");
    i = i + 1;
    if (i > imageCount - 1) {
      i = 0;
    }
    console.log(imageCount);

    console.log("i", i);

    openPicture(i);
  };
  const handleClick = () => {
    likeButtonVisible
      ? setLikeButtonVisible(false)
      : setLikeButtonVisible(true);
  };

  function reszie() {
    const cards = document.querySelector(".cards");
    const cardsChildren = Array.from(cards.children);
    const numImages = cardsChildren.length;
    // Adjust flex properties for the last row

    const numCols = Math.floor(
      cards.offsetWidth / cardsChildren[numImages - 1].offsetWidth
    );

    let numImagesInLastRow = 0;
    let totalWidth = 0;

    cardsChildren.forEach((item) => {
      totalWidth += item.offsetWidth;
      // If the total width exceeds the container width, reset total width and increase count
      if (totalWidth > cards.offsetWidth) {
        totalWidth = item.offsetWidth;
        numImagesInLastRow = 0;
      }
      numImagesInLastRow++;
    });

    const lastElemenet = cardsChildren.slice(-numImagesInLastRow);
    const otherElements = cardsChildren.slice(
      numImages - numImagesInLastRow - 3,
      -numImagesInLastRow
    );

    console.log(
      numImagesInLastRow,
      cardsChildren.slice(-numImagesInLastRow - 1)[0].offsetWidth
    );
    if (
      numImagesInLastRow === 1 &&
      cardsChildren.slice(-numImagesInLastRow - 1)[0].offsetWidth < 350
    ) {
      otherElements.forEach((item) => {
        flex(item.children[0], item);
      });
    } else {
      lastElemenet.forEach((item) => {
        item.style.flex = "0 0 auto";
        item.style.alignItems = "flex-start";
      });
    }
  }

  function flex(element, container) {
    if (element.naturalHeight > element.naturalWidth) {
      container.style.flex = `${element.naturalHeight / element.naturalWidth} ${
        element.naturalHeight / element.naturalWidth
      } auto`;
    } else {
      container.style.flex = `10 1 auto`;
    }
  }
  window.addEventListener("resize", () => {
    // Handle screen size change here
    reszie();
  });

  window.onload = function () {
    reszie();
  };

  function checkSubmission() {
    //check if picture and text added not text twice
    if (inputText !== "" && file !== null) {
      sendData(inputText, file);
    } else {
      if (inputText === "") {
        console.log("Enter Text Please");
      }
      if (file === null) {
        console.log("Enter File Please");
      }
    }
  }
  async function sendData(inputText, file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("text", inputText);
    formData.append("user", user);

    const response = await fetch("/api", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    addPicture(24, data.url, data.text);
  }

  function openPicture(i) {
    console.log("open picture", i);
    setPostContainer(true);
    //document.getElementById("post").style.display = "block";
    //setPictureContainer("none");
    let pic = document.getElementById("image");
    let comment = document.getElementsByClassName("comment")[0];
    let image = document.getElementById(i);
    comment.innerHTML = image.alt;
    pic.src = image.src;
    pic.className = i;
  }

  function closePicture() {
    setPostContainer(false);
  }

  //add picture to the page
  function addPicture(i, input, text) {
    let cardsContainer = document.querySelector(".cards");

    let flipCard = document.createElement("div");
    flipCard.className = "flip-card";

    let pic = document.createElement("img");
    pic.className = "pics";
    pic.id = `${i}`;
    pic.alt = text;
    pic.innerHTML = text;

    // Set image source
    if (input) {
      pic.src = input;
    }
    flex(pic, flipCard);

    /*
    if (
      pic.naturalHeight / 2 > pic.naturalWidth ||
      pic.naturalWidth / 2 > pic.naturalHeight
    ) {
      console.log("me");
      flipCard.style.flex = "1 1 auto";
    } else {
      console.log("not me");
      flipCard.style.flex = "10 1 auto";
    }
    */
    pic.loading = "lazy";

    // Attach click event handler to each picture
    pic.addEventListener("click", function () {
      openPicture(i);
    });

    flipCard.appendChild(pic);
    cardsContainer.appendChild(flipCard);
    // Calculate height after image has loaded
    pic.onload = function () {
      var height = pic.clientWidth;
    };
  }

  function showSubmitPage() {
    //shows the submit picture page
    setSubmitPicPage("visible");
    setPictureContainer(false);
    let submit_pic = document.getElementsByClassName("image-submit")[0];
    submit_pic.style.position = "relative";
    let card = document.getElementsByClassName("cards")[0];
    card.style.position = "absolute";
    //document.getElementById("go-back").style.display = "block";
  }

  function removeSubmitPage() {
    //shows the submit picture page
    setSubmitPicPage("hidden");
    setPictureContainer(true);
    //    document.getElementById("go-back").style.display = "none";
    let submit_pic = document.getElementsByClassName("image-submit")[0];
    submit_pic.style.position = "absolute";
    let card = document.getElementsByClassName("cards")[0];
    card.style.position = "relative";
    document.getElementById("input-text").style.innerHTML = "";
  }

  return (
    <>
      <NavBar></NavBar>
      <div id="status" position="fixed" fontSize="24px">
        {" "}
      </div>
      <div
        className="container-post"
        style={{
          display: postContainer ? "block" : "none",
        }}
        onClick={() => {
          closePicture();
        }}
      >
        <div
          id="post"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <div id="post-image">
            <img id="image"></img>
          </div>
          <div id="comment-section">
            <img
              className="like-button"
              id="heart"
              src="/Minecraft-heart.png"
              alt="heart"
              onClick={handleClick}
              style={{
                display: likeButtonVisible ? "block" : "none",
                width: likeButtonVisible ? "28px" : "25px",
              }}
            ></img>
            <img
              className="like-button"
              id="emptyHeart"
              src="empty_heart.png"
              alt="empty heart"
              onClick={handleClick}
              style={{ display: likeButtonVisible ? "none" : "block" }}
            ></img>
            <p className="comment"> </p>
          </div>
        </div>
        <button
          id="back-button"
          onClick={(event) => {
            event.stopPropagation();

            backButton(parseInt(document.getElementById("image").className));
          }}
        >
          {" "}
          <i class="arrow left"></i>
        </button>
        <button
          id="front-button"
          onClick={(event) => {
            event.stopPropagation();

            frontButton(parseInt(document.getElementById("image").className));
          }}
        >
          {" "}
          <i class="arrow right"></i>
        </button>
      </div>
      <button
        id="add-pic"
        style={{ display: pictureContainer ? "block" : "none" }}
        onClick={() => {
          showSubmitPage();
        }}
      >
        {" "}
        Add pic
      </button>
      <button id="go-back" onClick={() => removeSubmitPage()}>
        {" "}
        Go Back
      </button>
      <div className="image-submit" style={{ visibility: submitPicPage }}>
        <label htmlFor="input-file" id="input-file-label">
          Click Me To Add picture{" "}
        </label>
        <button
          id="submit-form"
          onClick={() => {
            removeSubmitPage();
            checkSubmission();
          }}
        >
          {" "}
          Submit
        </button>

        <input
          tpye="text"
          id="input-text"
          value={inputText}
          onChange={(event) => setInputText(event.target.value)}
        ></input>

        <input
          type="file"
          accept="image/jpeg,image/png, image/jpg"
          id="input-file"
          onChange={(event) => setFile(event.target.files[0])}
        ></input>

        <button
          style={{ display: "block" }}
          id="go-back-submit"
          onClick={() => {
            removeSubmitPage();
          }}
        >
          {" "}
          Go Back
        </button>
      </div>
      ''
      <div
        className="cards"
        style={{ display: pictureContainer ? "flex" : "none" }}
      ></div>
    </>
  );
}

export default Pics;
