import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import LogoSekolah from "../../assets/logo.png";
import api from "@/lib/api";
import { formLoginSchema } from "@/lib/form";

import { Root } from "@/components/partials/Root";
import { FormInputLayout } from "@/components/partials/FormLayout";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";

export default function Login() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post("auth/admin/login", data);
      if (response.data.success) {
        const { admin, token } = response.data.data;
  
        // SIMPAN TOKEN JWT
        localStorage.setItem("token", token);
  
        // opsional: simpan admin info juga
        localStorage.setItem("adminData", JSON.stringify(admin));
  
        navigate("/dashboard");
      } else {
        console.error("Login gagal:", response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Root>
      <main className="flex h-screen w-full items-center justify-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="mx-auto w-96">
              <CardHeader>
                <img
                  src={LogoSekolah}
                  alt="Logo SMK Negeri 7 Kota Kupang"
                  className="w-24 h-24 items-center justify-center mx-auto"
                />
                <CardTitle className="text-2xl text-center">
                  Login Admin
                </CardTitle>
                <CardDescription className="text-center">
                  SMK Negeri 7 Kota Kupang
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-1">
                  <div className="grid w-full items-center">
                    <div className="flex flex-col">
                      <FormInputLayout
                        control={form.control}
                        name="username"
                        label="Username"
                        type="text"
                      />
                    </div>
                    <div className="flex flex-col">
                      <FormInputLayout
                        control={form.control}
                        name="password"
                        label="Password"
                        type="password"
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Loading . . ." : "Login"}
                  </Button>
                  <Link
                    to="/"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Kembali
                  </Link>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </main>
    </Root>
  );
}
