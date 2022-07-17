---
title    : Video processing in browser using FFmpeg.wasm and Solidjs
description : Hi, Developers in this blog post i will show you how you can utilize ffmpeg in browser using their WASM binding with SolidJS
slug: video-processing-using-ffmpeg-and-solidjs
poster : https://res.cloudinary.com/practicaldev/image/fetch/s--v-oK8862--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/71m184bei1woslws4sju.png

postedAt : 17 Jul, 2022
tags: 
  - ffmpeg
  - solidjs
  - javascript
  - wasm


github : harshmangalam/ffmpeg-solidjs
---

Hi, Developers in this blog post i will show you how you can utilize ffmpeg in
browser using their WASM binding with SolidJS.

**According to WASM**

> WebAssembly (abbreviated Wasm) is a binary instruction format for a
> stack-based virtual machine. Wasm is designed as a portable compilation target
> for programming languages, enabling deployment on the web for client and
> server applications.

**FFmpeg**

FFmpeg is a cross-platform solution to record, convert and stream audio and
video.

**FFmpeg.wasm**

ffmpeg.wasm is a pure Webassembly / Javascript port of FFmpeg. It enables video
& audio record, convert and stream right inside browsers.

**SolidJS**

Solidjs is a Reactive, Performant, Powerful, Pragmatic and Productive Javascript
library.

In this post we will create a hook `useFFmpeg` hook that will handle to convert
a video file into `mp4` and play inside browser. We will design this web app
using `Hope ui`.

Create new solidjs project and install dependencies.

```
> npx degit solidjs/templates/js ffmpeg-solidjs
> cd ffmpeg-solidjs
> pnpm i
> pnpm run dev
```

Add Hope ui in solidjs project

```
> pnpm add @hope-ui/solid @stitches/core solid-transition-group
```

Add FFmpeg.wasm dependency

```
> pnpm add @ffmpeg/ffmpeg
```

Let's create `useFFmpeg.jsx` file inside `src/hooks`.

```jsx
import { createStore } from "solid-js/store";
import { onCleanup } from "solid-js";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

export default function useFFmpeg() {
  const [store, setStore] = createStore({
    progress: null,
    videoURL: null,
  });

  const ffmpeg = createFFmpeg({ progress: (e) => setStore("progress", e) });

  const transcode = async (file) => {
    const { name } = file;
    // load ffmpeg.wasm code
    await ffmpeg.load();
    // write file to  memory filesystem
    ffmpeg.FS("writeFile", name, await fetchFile(file));
    // convert video into mp4
    await ffmpeg.run("-i", name, "output.mp4");
    // read file from Memory filesystem
    const data = ffmpeg.FS("readFile", "output.mp4");
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" }),
    );

    setStore("videoURL", url);
    setStore("progress", null);
  };

  const handleFileChange = (e) => {
    // start video conversion on file change
    transcode(e.target.files[0]);
  };

  onCleanup(() => {
    // revoke created blob url object
    URL.revokeObjectURL(store.videoURL);
  });
  return {
    store,
    handleFileChange,
  };
}
```

`createFFmpeg()` function will init ffmpeg and handle logging all the details
during video manipulation , track progress of video manipulation etc..

Video progress will be stored in a reactive solidjs store so that we can utilize
this store to do reactive stuff.

`ffmpeg.load()` is an async method that will download core ffmpeg and init
ffmpeg wasm binary.

`ffmpeg.FS()` is a helper method that will help to work around memory filesystem
in browser.

`URL.createObjectURL()` static method create blob object url that you can
directly use inside html native element like `<video>`

After creating blob object url of video we will store inside reactive store so
that we can utilize this to play video.

when component will unmount we will clear blob object occupied memory using
`URL.revokeObjectURL()` static method.

Now we will connect `useFFmpeg` hook inside `App.jsx`.

```jsx
import {
  Box,
  Button,
  CircularProgress,
  CircularProgressIndicator,
  CircularProgressLabel,
  Container,
  Flex,
  GridItem,
  Heading,
  HopeProvider,
  HStack,
  SimpleGrid,
  Text,
  VStack,
} from "@hope-ui/solid";
import useFFmpeg from "./hooks/useFFmpeg";
import { Show } from "solid-js";
function App() {
  let fileRef;
  const { store, handleFileChange } = useFFmpeg();
  return (
    <HopeProvider config={{ initialColorMode: "dark" }}>
      <Container minH={"100vh"} display="grid" placeItems={"center"}>
        <Box py={"$4"}>
          <Heading fontSize={"$4xl"} textAlign="center">
            Video processing in browser using
            <Box>
              <Text as="span" color={"$success10"}>
                FFmpeg{" "}
              </Text>
              and{" "}
              <Text as="span" color={"$primary10"}>
                SolidJS
              </Text>
            </Box>
          </Heading>

          <HStack justifyContent={"center"} mt={"$6"}>
            <input
              type="file"
              name="file"
              id="file"
              hidden
              onChange={[handleFileChange]}
              ref={fileRef}
            />
            <Button onClick={() => fileRef.click()}>Select Video File</Button>
          </HStack>

          <Show when={store.progress}>
            <SimpleGrid
              columns={{ "@initial": 1, "@sm": 2, "@md": 2, "@lg": 3 }}
              justifyContent={"center"}
              alignItems="center"
              mt={"$6"}
              spacing={"$4"}
            >
              <GridItem mx="auto">
                <CircularProgress
                  value={Math.round(store.progress?.ratio * 100)}
                  size={"$52"}
                >
                  <CircularProgressIndicator color="$success10" />
                  <CircularProgressLabel>
                    <VStack spacing={"$2"}>
                      <Heading fontSize={"$xl"}>Ratio</Heading>
                      <Heading fontSize={"$3xl"}>
                        {Math.round(store.progress?.ratio * 100)} %
                      </Heading>
                    </VStack>
                  </CircularProgressLabel>
                </CircularProgress>
              </GridItem>

              <GridItem mx="auto">
                <CircularProgress value={100} size={"$52"} thickness={"$1"}>
                  <CircularProgressIndicator color="$success10" />
                  <CircularProgressLabel>
                    <VStack spacing={"$2"}>
                      <Heading fontSize={"$xl"}>Duration</Heading>
                      <Heading fontSize={"$3xl"}>
                        {store.progress?.duration}
                      </Heading>
                    </VStack>
                  </CircularProgressLabel>
                </CircularProgress>
              </GridItem>

              <GridItem mx="auto">
                <CircularProgress size={"$52"} indeterminate>
                  <CircularProgressIndicator color="$primary10" />
                  <CircularProgressLabel>
                    <VStack spacing={"$2"}>
                      <Heading fontSize={"$xl"}>Time</Heading>
                      <Heading fontSize={"$3xl"}>
                        {store.progress?.time}
                      </Heading>
                    </VStack>
                  </CircularProgressLabel>
                </CircularProgress>
              </GridItem>
            </SimpleGrid>
          </Show>

          <Show when={store.videoURL}>
            <Flex justifyContent={"center"} mt={"$6"}>
              <video
                src={store.videoURL}
                width={"400px"}
                height={"400px"}
                autoPlay
                controls
              />
            </Flex>
          </Show>
        </Box>
      </Container>
    </HopeProvider>
  );
}

export default App;
```

In last we will configure vite to handle cross origin isolation by adding
`Cross-Origin-Embedder-Policy` and `Cross-Origin-Opener-Policy` headers

```js
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [
    solidPlugin(),
    {
      name: "configure-response-headers",
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          next();
        });
      },
    },
  ],
  build: {
    target: "esnext",
    polyfillDynamicImport: false,
  },
});
```

Now start your dev server and select any video file.

```
pnpm run dev
```

![Home](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kvvwnnq2hib4y4leyb6b.png)

![Video](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/w6lbvbpitjha35kon0p2.png)
