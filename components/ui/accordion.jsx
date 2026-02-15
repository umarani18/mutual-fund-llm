"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * @typedef {Object} AccordionProps
 * @property {string} [className]
 * @property {React.ReactNode} [children]
 * @property {string} [value]
 * @property {() => void} [onClick]
 */

const Accordion = AccordionPrimitive.Root

/**
 * @typedef {Object} AccordionItemProps
 * @property {string} [className]
 * @property {React.ReactNode} [children]
 * @property {string} value
 */

/** @type {React.ForwardRefExoticComponent<AccordionItemProps & React.RefAttributes<HTMLDivElement>>} */
const AccordionItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn("border-b", className)} {...props}>
    {children}
  </AccordionPrimitive.Item>
))
AccordionItem.displayName = "AccordionItem"

/** @type {React.ForwardRefExoticComponent<AccordionProps & React.RefAttributes<HTMLButtonElement>>} */
const AccordionTrigger = React.forwardRef(({ className, children, onClick, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
        className
      )}
      onClick={onClick}
      {...props}>
      {children}
      <ChevronDown
        className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

/** @type {React.ForwardRefExoticComponent<AccordionProps & React.RefAttributes<HTMLDivElement>>} */
const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}>
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
