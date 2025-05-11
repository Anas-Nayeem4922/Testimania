"use client";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const images = [
    "https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/fe3550eaed5305bd3365a67bcdf3fe3f695347e8/66abd1bd6517e4d3ea57814a17b8645df4cc4188",
    "https://tw-elements.com/docs/standard/designblocks/testimonials/assets/testimonials-1-dark-min.webp",
    "https://s3-alpha.figma.com/hub/file/2768667413/722e8df1-e6eb-4172-acf0-b4223acf0c0b-cover.png",
    "https://theplusaddons.com/wp-content/uploads/2024/08/Testimonials-Grid-with-Image-Designation-and-Ratings.webp",
    "https://market-resized.envatousercontent.com/videohive.net/files/498862515/2560x1440.jpg?auto=format&q=85&cf_fit=crop&gravity=top&h=8000&w=590&s=41320fcda315046fce5fa64f8ef688f98254d923eab396c4c5fe2164f4696146",
    "https://elements-resized.envatousercontent.com/elements-preview-images/898d8469-e8c6-4f66-9a16-c2fc1cba88f0?w=632&cf_fit=scale-down&q=85&format=auto&s=5810d094a8507e957e894b86faecc54399fffafb6bd854bbdd2d8ff1fef76ce6",
    "https://elements-resized.envatousercontent.com/elements-cover-images/e7a7b0ca-8416-49b0-99d1-bbb978adef32?w=433&cf_fit=scale-down&q=85&format=auto&s=a6afc6a82a98780f4170a512d358ec897a18c5b51b9ca9491323a40352b94a5a",
    "https://embedsocial.com/wp-content/uploads/2023/03/dark-google-reviews-grid-widget.jpg",
    "https://onepagelove.imgix.net/2025/02/2025-02-24.jpeg?w=360&max-h=480&fit=crop&fp-y=0&auto=compress",
    "https://cdn.dribbble.com/userupload/4109130/file/original-69a24585c19f49aca95a4c57805a7fe0.png?format=webp&resize=400x300&vertical=center",
    "https://cdn.dribbble.com/userupload/16046272/file/original-6283066621bce32e2b87e5d8f33b78d8.png?resize=400x0",
    "https://cdn.dribbble.com/userupload/14725814/file/original-7b594339b5ff48dbf82b4d16282f07b5.png?resize=2048x1536&vertical=center",
    "https://cdn.dribbble.com/userupload/18468585/file/still-6e39bd034c68bcf59a75e03df32b1d86.png?format=webp&resize=400x300&vertical=center",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTafmBft0up8KHz8CsXYTjnB89xD5fIb0FOAHj6iS_XhNKd2q-zPBVrwpq7MqN6jlHulPI&usqp=CAU",
    "https://firebasestorage.googleapis.com/v0/b/testimonialto.appspot.com/o/assets%2Ffeatures%2Fmetrics.png?alt=media&token=c5aa1272-4d36-4f9f-8ee6-df660985e7e1",
    "https://firebasestorage.googleapis.com/v0/b/testimonialto.appspot.com/o/assets%2Ffeatures%2Fmore-social-proof.png?alt=media&token=83a1a3e9-449d-457d-80fb-0cfa55484700",
    "https://i.ytimg.com/vi/nTTpdW-PlWY/maxresdefault.jpg",
    "https://firebasestorage.googleapis.com/v0/b/testimonialto.appspot.com/o/assets%2Ffeatures%2Fwall-of-love.png?alt=media&token=74e955e5-a21b-4cc6-ab05-d497b7fb313a",
    "https://huemordev.b-cdn.net/wp-content/uploads/2021/11/2023.04.04.How-to-Use-Testimonials-Effectively-On-Your-Website.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMM-hF_LVDR_OFFMZ1D8uoufQkaLJzCD4sNT5_I-tnCsKwmK84eLAZgiCcj-vSaQkxAKA&usqp=CAU",
    "https://diviextended.com/wp-content/uploads/2022/07/per-view-testimonials.webp",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7pinSID7YAadlCevwWFKoVJ4iuA2clp7rtg&s",
    "https://uploads-ssl.webflow.com/667eab1dd61c6d2a1c9ee8ee/66c423c46cf889133e87a779_DarkCaptivatingTestimonials%25281%2529.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpl2ueVkXHeQEATl52X1rOehKURhIGlPNzn6cnfsWZYRSi2hNBicMzcYvUosbHU3aWq4w&usqp=CAU",
    "https://cdn.dribbble.com/userupload/12491854/file/still-2cfb12463c749e269bb1189995ef4650.png",
    "https://s3-figma-hubfile-images-production.figma.com/hub/file/carousel/img/fe3550eaed5305bd3365a67bcdf3fe3f695347e8/66abd1bd6517e4d3ea57814a17b8645df4cc4188",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTafmBft0up8KHz8CsXYTjnB89xD5fIb0FOAHj6iS_XhNKd2q-zPBVrwpq7MqN6jlHulPI&usqp=CAU",
    "https://tw-elements.com/docs/standard/designblocks/testimonials/assets/testimonials-1-dark-min.webp",
    "https://static.vecteezy.com/system/resources/previews/000/268/864/non_2x/dark-testimonial-page-interface-design-template-vector.jpg",
    "https://www.figma.com/community/resource/62998d8e-124e-42b0-b36e-69d9af9df252/thumbnail",
    "https://onepagelove.imgix.net/2025/02/2025-02-24.jpeg?w=360&max-h=480&fit=crop&fp-y=0&auto=compress",
  ];
  
  const router = useRouter();
  const session = useSession();

  return (
    <div className="relative flex h-screen w-full min-w-full flex-col items-center justify-center overflow-hidden rounded-3xl">
      <h2 className="relative z-20 mx-auto max-w-4xl text-center text-2xl font-bold text-balance text-white md:text-4xl lg:text-6xl">
            From Blah to Aha! Make Your Praise the{" "}
        <span className="relative z-20 inline-block rounded-xl bg-blue-500/40 px-4 py-1 text-white underline decoration-sky-500 decoration-[6px] underline-offset-[16px] backdrop-blur-sm">
            Star
        </span>{" "}
        of the Show.
      </h2>
      <p className="relative z-20 mx-auto max-w-2xl py-8 text-center text-sm text-neutral-200 md:text-base">
        Capture authentic love from your users and turn it into scroll-stopping proof. Turn real testimonials into trust-building power—seamlessly collected and beautifully displayed.
      </p>

      <div className="relative z-20 flex flex-wrap items-center justify-center gap-4 pt-4">
        <button onClick={() => {
          if(session.status === "unauthenticated") {
            router.push("/signup");
          } else {
            router.push("/dashboard");
          }
        }} className="rounded-md bg-sky-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-black focus:outline-none cursor-pointer">
          Join the cult
        </button>
        <button className="rounded-md border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-black focus:outline-none">
          Read more
        </button>
      </div>

      {/* overlay */}
      <div className="absolute inset-0 z-10 h-full w-full bg-black/80 dark:bg-black/40" />
      <ThreeDMarquee
        className="pointer-events-none absolute inset-0 h-full w-full"
        images={images}
      />
    </div>
  );
}
