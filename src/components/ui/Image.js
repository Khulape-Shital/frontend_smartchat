
 "use client"
 import Image from "next/image"
 import styles from "./Image.module.css"

 export default function ImageComp({
    src,
    alt,
    width,
    height,
    className,

 }
 
){
    return (
        <div className={styles.imageWrapper}>
            <Image
             src={src}
             alt={alt}
             width={width}
             height={height}
             className={className}
            />

        </div>
    )
}