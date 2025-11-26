/* eslint-disable react/prop-types */
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { id } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Textarea } from "../ui/textarea";

const FormInputLayout = ({
  control,
  name,
  label,
  placeholder,
  type,
  description,
  disabled,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              {...field}
            />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const FormInputFileLayout = ({
  control,
  name,
  label,
  placeholder,
  type,
  description,
  disabled,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              accept={type === "file" ? ".pdf, .doc, .docx" : undefined}
              {...field}
            />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const FormSelectLayout = ({
  control,
  name,
  label,
  placeholder,
  options,
  description,
  onValueChange,
  disabled,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={(value) => {
              const selectedOption = options.find(
                (option) => option.value === value
              );
              const actualValue = selectedOption ? selectedOption.value : value;
              field.onChange(actualValue);
              if (onValueChange) {
                onValueChange(actualValue);
              }
            }}
            value={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} {...field} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const FormTextareaLayout = ({
  control,
  name,
  label,
  placeholder,
  description,
  disabled,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              disabled={disabled}
              {...field}
            />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const FormDateLayout = ({ control, name, label, placeholder, description }) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP", { locale: id })
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : null}
                onSelect={field.onChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export {
  FormTextareaLayout,
  FormInputLayout,
  FormInputFileLayout,
  FormSelectLayout,
  FormDateLayout,
};
