"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getSaccoSettings } from "@/lib/actions";
import FosaStatementPDF from "./pdf/fosa";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import TransactionTable from "./statment";

export default function FosaStatementForm() {
  const [loading, setLoading] = useState(false);

  const [sacco, setSacco] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [dncData, setDncData] = useState(null);
  const [member, setMember] = useState("");

  async function searchMember() {
    if (!searchQuery) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/dnc?memberNo=${searchQuery}`);
      const fosaData = await res.json();
      setDncData(fosaData);

      const memberRes = await fetch(`/api/members/${searchQuery}`);
      const memberData = await memberRes.json();
      setMember(memberData);
    } catch (error) {
      console.error("Error fetching member data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function fetchSaccoSettings() {
      try {
        const data = await getSaccoSettings();
        setSacco(data);
      } catch (error) {
        console.error("Error fetching SACCO settings:", error);
      }
    }
    fetchSaccoSettings();
  }, []);

  return (
    <>
      {loading ? (
         <p className="loading"></p>
      ) : (
        <div className="w-[70vw]">
          <h3 className="font-semibold text-center">Member Statement</h3>

          {/* Search Input */}
          <div className="flex gap-2 mb-5 w-[30rem]">
            <Input
              type="text"
              placeholder="Search Member Number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button onClick={searchMember} disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>

          {/* Display Member Details */}
          <div>
            <form className="grid gap-4 py-4 grid-cols-3">
              <div>
                <Label className="mb-1">Member Number</Label>
                <Input value={member.memberNo} readOnly />
              </div>

              <div>
                <Label className="mb-1">Member Number</Label>
                <Input value={member.fullName} readOnly />
              </div>

              <div>
                <Label className="mb-1">Member Number</Label>
                <Input value={member.accountNumber} readOnly />
              </div>
            </form>
          </div>
          {/* statment table */}
          <div className="mt-5 mb-10">
            <h4 className="text-center font-semibold mb-2">Statement</h4>
            <TransactionTable dncData={dncData} />
          </div>

          {/* PDF Preview & Download */}
          <Dialog>
            <DialogTrigger>
              <Button>PDF Statement</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Statement</DialogTitle>
                <DialogDescription>
                  {dncData && dncData.length > 0 && member && sacco && (
                    <div className="mt-5">
                      <h4 className="font-semibold text-lg">Preview & Print</h4>

                      <div className="border p-3 mt-3">
                        <PDFViewer width="100%" height="400px">
                          <FosaStatementPDF
                            data={dncData}
                            member={member}
                            sacco={sacco}
                          />
                        </PDFViewer>
                      </div>

                      <div className="mt-4">
                        <PDFDownloadLink
                          document={
                            <FosaStatementPDF
                              data={dncData}
                              member={member}
                              sacco={sacco}
                            />
                          }
                          fileName="Statement.pdf"
                        >
                          {({ loading }) => (
                            <Button disabled={loading}>
                              {loading ? "Generating PDF..." : "Download PDF"}
                            </Button>
                          )}
                        </PDFDownloadLink>
                      </div>
                    </div>
                  )}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
}
