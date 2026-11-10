/**
 * chat-bubble.tsx – Chat bubble primitives
 * Reusable chat UI building blocks (bubble, avatar, message, timestamp,
 * action) built with cva; used to render the conversational AI-chat
 * sections of the portfolio.
 */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Button, ButtonProps } from "../button";
import MessageLoading from "./message-loading";

// ChatBubble
/**
 * chatBubbleVariant – cva variant map for the bubble row wrapper.
 * `variant` aligns the row: "received" hugs the left, "sent" reverses the
 * row and centers it; `layout` switches to the full-width "ai" arrangement.
 */
const chatBubbleVariant = cva(
  "flex gap-2 items-start relative group",
  {
    variants: {
      variant: {
        received: "self-start w-full",
        sent: "self-center flex-row-reverse mx-auto",
      },
      layout: {
        default: "",
        ai: "max-w-full w-full items-center",
      },
    },
    defaultVariants: {
      variant: "received",
      layout: "default",
    },
  }
);

interface ChatBubbleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatBubbleVariant> {}

/**
 * ChatBubble – message row container.
 * Clones valid element children to inject the row's `variant`/`layout`
 * (e.g. into ChatBubbleMessage) so every part of the bubble stays in sync
 * without extra prop wiring.
 */
const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ className, variant, layout, children, ...props }, ref) => (
    <div
      className={cn(
        chatBubbleVariant({ variant, layout, className }),
        "relative group"
      )}
      ref={ref}
      {...props}
    >
      {/* Clone element children to inject variant/layout; plain-text
          children are passed through untouched. */}
      {React.Children.map(children, (child) =>
        React.isValidElement(child) && typeof child.type !== "string"
          ? React.cloneElement(child, {
              variant,
              layout,
            } as React.ComponentProps<typeof child.type>)
          : child
      )}
    </div>
  )
);
ChatBubble.displayName = "ChatBubble";

// ChatBubbleAvatar
interface ChatBubbleAvatarProps {
  src?: string;
  fallback?: string;
  className?: string;
  width?: number;
  height?: number;
}

/**
 * ChatBubbleAvatar – avatar for a bubble row; shows the `fallback` text
 * until `src` finishes loading.
 */
const ChatBubbleAvatar: React.FC<ChatBubbleAvatarProps> = ({
  src,
  fallback,
  className,
  width,
  height,
}) => (
  <Avatar>
    <AvatarImage
      src={src}
      alt="Avatar"
      className={className}
      width={width}
      height={height}
    />
    <AvatarFallback>{fallback}</AvatarFallback>
  </Avatar>
);

// ChatBubbleMessage
/**
 * chatBubbleMessageVariants – cva variant map for the message pill.
 * `variant` styles the bubble ("sent" gets the blue iOS-style pill),
 * `layout` adds the full-width transparent style used by the AI layout.
 */
const chatBubbleMessageVariants = cva("", {
  variants: {
    variant: {
      received:
        "text-secondary-foreground rounded-lg py-2",
      sent: "p-2 px-5 bg-[#007AFF] text-white rounded-3xl",
    },
    layout: {
      default: "",
      ai: "border-t w-full rounded-none bg-transparent",
    },
  },
  defaultVariants: {
    variant: "received",
    layout: "default",
  },
});

interface ChatBubbleMessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatBubbleMessageVariants> {
  isLoading?: boolean;
}

/**
 * ChatBubbleMessage – text area of a bubble.
 *
 * @param isLoading - Renders the MessageLoading typing indicator instead of
 *                    the children while a reply is streaming in.
 */
const ChatBubbleMessage = React.forwardRef<
  HTMLDivElement,
  ChatBubbleMessageProps
>(
  (
    { className, variant, layout, isLoading = false, children, ...props },
    ref
  ) => (
    <div
      className={cn(
        chatBubbleMessageVariants({ variant, layout, className }),
        "break-words max-w-full whitespace-pre-wrap"
      )}
      ref={ref}
      {...props}
    >
      {/* While a reply streams in, show the typing indicator instead of
          the message text. */}
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <MessageLoading />
        </div>
      ) : (
        children
      )}
    </div>
  )
);
ChatBubbleMessage.displayName = "ChatBubbleMessage";

// ChatBubbleTimestamp
/**
 * ChatBubbleTimestamp – small right-aligned time label shown under a
 * message; takes the already-formatted `timestamp` string.
 */
interface ChatBubbleTimestampProps
  extends React.HTMLAttributes<HTMLDivElement> {
  timestamp: string;
}

const ChatBubbleTimestamp: React.FC<ChatBubbleTimestampProps> = ({
  timestamp,
  className,
  ...props
}) => (
  <div className={cn("text-xs mt-2 text-right", className)} {...props}>
    {timestamp}
  </div>
);

// ChatBubbleAction
/**
 * ChatBubbleAction – icon-only ghost button for bubble hover actions
 * (copy, retry, ...); defaults to variant="ghost" / size="icon".
 */
type ChatBubbleActionProps = ButtonProps & {
  icon: React.ReactNode;
};

const ChatBubbleAction: React.FC<ChatBubbleActionProps> = ({
  icon,
  onClick,
  className,
  variant = "ghost",
  size = "icon",
  ...props
}) => (
  <Button
    variant={variant}
    size={size}
    className={className}
    onClick={onClick}
    {...props}
  >
    {icon}
  </Button>
);

interface ChatBubbleActionWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "sent" | "received";
  className?: string;
}

/**
 * ChatBubbleActionWrapper – positions action buttons beside a bubble.
 * Kept at opacity-0 until the parent `.group` row is hovered; placed to the
 * left of "sent" messages and to the right of "received" ones.
 */
const ChatBubbleActionWrapper = React.forwardRef<
  HTMLDivElement,
  ChatBubbleActionWrapperProps
>(({ variant, className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute top-1/2 -translate-y-1/2 flex opacity-0 group-hover:opacity-100 transition-opacity duration-200",
      variant === "sent"
        ? "-left-1 -translate-x-full flex-row-reverse"
        : "-right-1 translate-x-full",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
ChatBubbleActionWrapper.displayName = "ChatBubbleActionWrapper";

export {
	ChatBubble, ChatBubbleAction,
	ChatBubbleActionWrapper, ChatBubbleAvatar,
	ChatBubbleMessage, chatBubbleMessageVariants, ChatBubbleTimestamp,
	chatBubbleVariant
};

