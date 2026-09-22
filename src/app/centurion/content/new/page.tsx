import React from "react";
import { ContentEditor } from "../editor/ContentEditor";

export const metadata = {
  title: "New Publication | Centurion Content Studio",
};

export default function NewContentPage() {
  return <ContentEditor isNew={true} />;
}
