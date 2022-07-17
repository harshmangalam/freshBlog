---
title    : Image upload using SolidJS and Cloudinary
description : In this post we will upload Image from local  to cloudinary. We will create `useCloudinary` hook that will take care of the stuff related to file upload.

slug: Image-upload-using-SolidJS-and-Cloudinary
poster : https://res.cloudinary.com/practicaldev/image/fetch/s--sgToX07F--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mx2r7lm1ptk1et47hrvf.png

postedAt : 17 Jul, 2022
tags: 
  - solidjs
  - cloudinary
  - javascript
  - axios
  - suid

authorName: Harsh mangalam 
authorAvatar: https://avatars.githubusercontent.com/u/57381638?v=4

github : harshmangalam/solid-cloudinary-image-upload
---

In this post we will upload Image from local to cloudinary. We will create
`useCloudinary` hook that will take care of the stuff related to file upload.

## Libraries

- SolidJS
- Axios
- SUID
- Shortid

## Features

- Image preview
- Upload to Cloudinary
- Progress bar
- Abort image upload

`src/hooks/useCloudinary.jsx`

```jsx
import axios from "axios";
import shortid from "shortid";
import { createStore } from "solid-js/store";

const url =
  `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;

export default function useCloudinary() {
  const [store, setStore] = createStore({
    image: null,
    imagePreview: "",
    uploadProgress: 0,
    alert: null,
    abortToken: null,
  });

  function handleImageChange(e) {
    const image = e.target.files[0];
    // create blob url of selected image for preview
    const imagePreview = URL.createObjectURL(image);
    // create axios cancellation token to abort request in future
    const abortToken = axios.CancelToken.source();

    setStore("image", image);
    setStore("imagePreview", imagePreview);
    setStore("abortToken", abortToken);
    setStore("alert", {
      severity: "success",
      text: "Image loaded successfully",
    });
  }
  function handleImageRemove() {
    // cleanup blob  metadata
    URL.revokeObjectURL(store.imagePreview);
    window.location.reload();
  }
  async function handleImageUpload() {
    try {
      const formData = new FormData();
      formData.append("file", store.image);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      );
      formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
      formData.append("public_id", shortid.generate());

      const response = await axios.post(url, formData, {
        onUploadProgress: handleUploadProgress,
        cancelToken: store.abortToken.token,
      });
      setStore("alert", {
        severity: "success",
        text: "Image uploaded to cloudinary successfully",
      });

      // revoke preview blob url
      URL.revokeObjectURL(store.imagePreview);
      setStore("imagePreview", response.data.url);
    } catch (error) {
      console.log(error);
    }
  }

  function handleUploadProgress(progressEv) {
    const progress = Math.floor((progressEv.loaded / store.image.size) * 100);
    console.log(progress);
    setStore("uploadProgress", progress);
  }

  function handleCancelUpload() {
    store.abortToken.cancel();
    setStore("alert", {
      severity: "error",
      text: "Image upload aborted",
    });
  }
  return {
    store,
    handleImageChange,
    handleImageRemove,
    handleImageUpload,
    handleCancelUpload,
  };
}
```

we have created a new store and initialise with initial value.

`image` field will store image selected from local.

`imagePreview` field will store image url for image preview and cloudinary url
after successfully uploaded.

`uploadProgress` field will show percentage of image data uploaded to
cloudinary.

`alert` show success, error and warning message.

`abortToken` field will store Axios CancelTokenSource which help to abort
request in middle.

`handleImageChange()` function create blob url of image for preview and axios
cancellation token which we can use in future to cancel request in middle.

`handleImageRemove()` method remove preview image and revoke blob url to clean
memory acquired by blob metadata.

`handleImageUpload()` function upload image to cloudinary using axios post
request and when image successfully uploaded it revoke blob url and show image
from cloudinary url.

`handleUploadProgress()` function track uploaded chunk of image data.

`handleCancelUpload()` function cancel axios request.

Create `.env` file in project root and add required environment variable.

`.env`

```
VITE_CLOUDINARY_UPLOAD_PRESET=
VITE_CLOUDINARY_API_KEY=
VITE_CLOUDINARY_CLOUD_NAME=
```

Prefix with `VITE_` is required if you want to access your environment variable
in browser.

We will create UI using SUID library. SUID is a Component Material design for
Solidjs ported from MUI React.

```jsx
import { ThemeProvider } from "@suid/material";
import Alert from "@suid/material/Alert";
import Button from "@suid/material/Button";
import Card from "@suid/material/Card";
import CardActions from "@suid/material/CardActions";
import CardMedia from "@suid/material/CardMedia";
import Container from "@suid/material/Container";
import Grid from "@suid/material/Grid";
import LinearProgress from "@suid/material/LinearProgress";
import Stack from "@suid/material/Stack";
import { Show } from "solid-js";
import useCloudinary from "./hooks/useCloudinary";

function App() {
  let fileInputRef = null;
  const {
    store,
    handleImageChange,
    handleImageRemove,
    handleImageUpload,
    handleCancelUpload,
  } = useCloudinary();
  return (
    <ThemeProvider>
      <Container>
        <Grid container sx={{ justifyContent: "center" }}>
          <Grid item md={6} xs={12}>
            <Show when={store.alert}>
              <Alert sx={{ mt: 4, mb: 4 }} severity={store.alert.severity}>
                {store.alert.text}
              </Alert>
            </Show>

            <input
              type="file"
              hidden
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
            />
            <Button
              onClick={() => fileInputRef.click()}
              variant="contained"
              size="large"
            >
              Select Image
            </Button>

            <Show when={store.uploadProgress}>
              <Stack direction={"column"} spacing={2}>
                <LinearProgress
                  sx={{ mt: 4 }}
                  variant="determinate"
                  value={store.uploadProgress}
                />
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCancelUpload}
                >
                  Cancel Upload
                </Button>
              </Stack>
            </Show>

            <Show when={store.imagePreview}>
              <Card sx={{ mt: 4 }}>
                <CardMedia
                  component="img"
                  height="600px"
                  image={store.imagePreview}
                  alt="Image Preview"
                />

                <CardActions>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleImageRemove}
                  >
                    Remove
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleImageUpload}
                  >
                    Upload
                  </Button>
                </CardActions>
              </Card>
            </Show>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
```
