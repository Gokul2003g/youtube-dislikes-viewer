import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  Chrome,
  Frown,
  Globe,
  Meh,
  Smile,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

function App() {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [likeToDislikeRatio, setLikeToDislikeRatio] = useState(0.0);
  const { toast } = useToast();

  const formSchema = z.object({
    link: z.string().url("Url is Invalid"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const regExp = /^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#&?]*).*/;

      const videoId = values.link.match(regExp);

      if (videoId) {
        const response = await axios.get(
          `https://returnyoutubedislikeapi.com/votes?videoId=${videoId[1]}`,
        );

        setDislikes(response.data.dislikes);
        setLikes(response.data.likes);
        setLikeToDislikeRatio(response.data.likes / response.data.dislikes);
        console.log(response);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: "Possibly wrong video link, Try Again.",
      });
    }
  }

  let reaction;
  if (likeToDislikeRatio > 10) {
    reaction = (
      <div>
        <Smile className="inline mr-4" fill="green" />
        {likeToDislikeRatio}
      </div>
    );
  } else if (likeToDislikeRatio > 0 && likeToDislikeRatio <= 10) {
    reaction = (
      <div>
        <Meh fill="orange" className="inline mr-4" />
        {likeToDislikeRatio}
      </div>
    );
  } else {
    reaction = (
      <div>
        <Frown className="inline mr-4" fill="red" />
        {likeToDislikeRatio}
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster />
      <div className="bg-gradient-to-br from-red-800 to-white dark:to-black h-screen w-full flex flex-col items-center justify-center">
        <div className="top-2 right-2 absolute">
          <ModeToggle />
        </div>
        <div className="dark:bg-black bg-white bg-opacity-40 flex flex-col justify-center gap-4 dark:bg-opacity-60 rounded-lg px-28 py-12 text-black dark:text-white">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl">
                      Paste the video link
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Paste Link Here" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">View Response</Button>
            </form>
          </Form>
          <Separator />
          <div className="flex flex-col text-lg gap-4">
            <div>
              <ThumbsUp className="inline mr-4" fill="green" />
              {likes}
            </div>
            <div>
              <ThumbsDown className="inline mr-4" fill="red" />
              {dislikes}
            </div>
            {reaction}
          </div>
        </div>
        <footer className="text-sm">
          Thanks to
          <a href="https://returnyoutubedislike.com" target="_blank">
            <Button variant="link">returnyoutubedislike.com</Button>
          </a>
          for the api.
        </footer>
        <div className="bottom-2 left-2 absolute flex items-center">
          Install extension for
          <a
            href="https://chromewebstore.google.com/detail/return-youtube-dislike/gebbhagfogifgggkldgodflihgfeippi"
            target="_blank"
          >
            <Button variant="outline" className="mx-2">
              <Chrome className="mr-2" />
              Chromium
            </Button>
          </a>
          and
          <a
            href="https://addons.mozilla.org/en-US/firefox/addon/return-youtube-dislikes/"
            target="_blank"
          >
            <Button variant="outline" className="mx-2">
              <Globe className="mr-2" />
              Firefox
            </Button>
          </a>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
