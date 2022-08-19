import React, { useState, useEffect, ChangeEvent } from "react"
import s from "../FormComponents.module.scss"
import contentHolder from "../../../../assets/img/content-holder.png"
import { loadImage } from "../../../utils/loadImage"

export const File = ({ ...props }) => {
  const setPreviewImage = (file: File) => {
    loadImage(file, props.name, "preview-img-holder", props.setFieldValue)
  }

  return (
    <div className={s.filePicker}>
      <input
        type="file"
        ref={props.changePreviewFile}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          e.preventDefault()
          if (e.target.files && e.target.files.length) {
            setPreviewImage(e.target.files[0])
          }
        }}
      />
      <div style={{ marginTop: "20px" }}>
        <img
          id="preview-img-holder"
          src={props.field.value ? props.field.value : contentHolder}
          alt="preview-img"
        />
      </div>
    </div>
  )
}
