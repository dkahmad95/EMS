"use client";

import React from "react";
import { TextField, Autocomplete } from "@mui/material";
import FormModal from "@/app/Components/FormModal";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/server/services/api/users/users";
import { useTokenOffices } from "@/app/hooks/useTokenOffices";
import { usePermissions } from "@/app/hooks/usePermissions";
import { usePermissionGroups } from "@/server/store/permissionGroups";

interface UpdateUserModalProps {
    open: boolean;
    onClose: () => void;
    user: User | null;
}

type UpdateUserFormInputs = {
    name: string;
    username: string;
    officeId: number | null; // null = access to all offices
    permissionGroupId: number;
    password: string;
    confirmPassword: string;
};

type OfficeOption = { id: number | null; name: string };

const ALL_OFFICES_OPTION: OfficeOption = { id: null, name: "جميع المكاتب" };

const UpdateUserModal: React.FC<UpdateUserModalProps> = ({
    open,
    onClose,
    user,
}) => {
    const queryClient = useQueryClient();

    const { data: officesList } = useTokenOffices();
    const { hasAllOfficesAccess } = usePermissions();
    const { data: permissionGroupsList } = usePermissionGroups();

    // "All offices" (office_id = null) can only be granted by someone who has it
    const officeOptions: OfficeOption[] = hasAllOfficesAccess
        ? [ALL_OFFICES_OPTION, ...officesList]
        : officesList;

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        reset,
    } = useForm<UpdateUserFormInputs>();


    React.useEffect(() => {
        if (user && open) {
            reset({
                name: user.name ?? "",
                username: user.username ?? "",
                officeId: user.office_id ?? null,
                permissionGroupId: user.permission_group_id,
                password: "",
                confirmPassword: "",
            });
        }
    }, [user, open, reset]);


    React.useEffect(() => {
        register("officeId", {
            validate: (v) => v !== undefined || "المكتب مطلوب",
        });
        register("permissionGroupId", { required: "مجموعة الصلاحيات مطلوبة" });
    }, [register]);

    const watchedPassword = watch("password");

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateUserRequest }) =>
            updateUser(id, data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            alert("تم تحديث المستخدم بنجاح");
            reset();
            onClose();
        },

        onError: (error: any) => {
            alert(
                `حدث خطأ أثناء تحديث المستخدم: ${error.response?.data?.message || error.message
                }`
            );
        },
    });

    const onSubmit = (data: UpdateUserFormInputs) => {
        if (!user?.id) return;
        const payload: UpdateUserRequest = {
            name: data.name,
            username: data.username,
            // omitted officeId => backend stores office_id = null (all offices)
            officeId: data.officeId ?? undefined,
            permissionGroupId: data.permissionGroupId ?? undefined,
        };


        if (data.password) {
            payload.password = data.password;
        }

        updateMutation.mutate({ id: user.id, data: payload });
    };

    const handleClose = () => {
        if (!updateMutation.isPending) {
            reset();
            onClose();
        }
    };


    const selectedOffice =
        officeOptions.find((o) => o.id === (user?.office_id ?? null)) ?? null;
    const selectedPermissionGroup =
        permissionGroupsList?.find((pg) => pg.id === user?.permission_group_id) ??
        null;

    if (!user) return null;

    return (
        <FormModal
            open={open}
            onClose={handleClose}
            title="تعديل بيانات المستخدم"
            size="md"
            onConfirm={() => handleSubmit(onSubmit)()}
            isLoading={updateMutation.isPending}
            confirmLabel="حفظ التعديلات"
        >
            {/* الاسم */}
            <TextField
                fullWidth
                label="الاسم"
                variant="outlined"
                {...register("name", {
                    required: "الاسم مطلوب",
                    minLength: {
                        value: 3,
                        message: "الاسم يجب أن يكون 3 أحرف على الأقل",
                    },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={updateMutation.isPending}
            />

            {/* اسم المستخدم */}
            <TextField
                fullWidth
                label="اسم المستخدم"
                variant="outlined"
                {...register("username", {
                    required: "اسم المستخدم مطلوب",
                    minLength: {
                        value: 3,
                        message: "اسم المستخدم يجب أن يكون 3 أحرف على الأقل",
                    },
                })}
                error={!!errors.username}
                helperText={errors.username?.message}
                disabled={updateMutation.isPending}
            />

            {/* المكتب */}
            <Autocomplete
                key={`office-${user.id}-${open}`}
                options={officeOptions}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                defaultValue={selectedOffice}
                onChange={(_, val) => {
                    setValue("officeId", (val ? val.id : undefined) as number | null, {
                        shouldValidate: true,
                    });
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="المكتب"
                        error={!!errors.officeId}
                        helperText={errors.officeId?.message}
                        disabled={updateMutation.isPending}
                    />
                )}
            />

            {/* مجموعة الصلاحيات */}
            <Autocomplete
                key={`pg-${user.id}-${open}`}
                options={permissionGroupsList ?? []}
                getOptionLabel={(option) => option.name}
                defaultValue={selectedPermissionGroup}
                onChange={(_, val) => {
                    setValue("permissionGroupId", val?.id as number, {
                        shouldValidate: true,
                    });
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="مجموعة الصلاحيات"
                        error={!!errors.permissionGroupId}
                        helperText={errors.permissionGroupId?.message}
                        disabled={updateMutation.isPending}
                    />
                )}
            />

            {/* كلمة المرور الجديدة (اختياري) */}
            <TextField
                fullWidth
                type="password"
                label="كلمة المرور الجديدة (اختياري)"
                {...register("password", {
                    minLength: {
                        value: 8,
                        message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
                    },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={updateMutation.isPending}
            />

            {/* تأكيد كلمة المرور */}
            <TextField
                fullWidth
                type="password"
                label="تأكيد كلمة المرور"
                {...register("confirmPassword", {
                    validate: (v) =>
                        !watchedPassword ||
                        v === watchedPassword ||
                        "كلمتا المرور غير متطابقتين",
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                disabled={updateMutation.isPending}
            />
        </FormModal>
    );
};

export default UpdateUserModal;
