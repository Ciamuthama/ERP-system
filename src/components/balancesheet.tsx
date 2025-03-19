"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Drc }from "./modal/drc";

const formSchema = z.object({
  description: z.union([z.string(), z.number()]),
  documentNo: z.string(),
  fullName: z.string(),
  memberNo: z.union([z.string(), z.number()]),
  amount: z.union([z.string(), z.number()]),
});

export function DebitCreditCards() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      documentNo: "",
      fullName: "",
      memberNo: "",
      amount: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <>
      <Select>
        <SelectTrigger className="w-[250px] mb-3">
          <SelectValue placeholder="Select a Card" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel></SelectLabel>
            <SelectItem value="debit">Debit</SelectItem>
            <SelectItem value="credit">Credit</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <ResizablePanelGroup
        direction="horizontal"
        className="rounded-lg border w-full"
      >
        <ResizablePanel defaultSize={30}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 px-5 pt-4"
            >
              <FormField
                control={form.control}
                name="memberNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Member Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>FullName</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary Account</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name="documentNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
         <Drc/>
          <ResizableHandle />
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
