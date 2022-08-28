import {
  createStyles,
  Navbar,
  Stack,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import {
  IconCategory,
  IconDeviceGamepad2,
  IconHome,
  IconSettings,
  TablerIcon,
} from "@tabler/icons";
import { Link } from "@tanstack/react-location";
import { MouseEventHandler } from "react";

const useStyles = createStyles((theme) => ({
  link: {
    width: 50,
    height: 50,
    borderRadius: theme.radius.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.white,
    opacity: 0.85,

    "&:hover": {
      opacity: 1,
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor })
          .background,
        0.1
      ),
    },
  },

  active: {
    opacity: 1,
    "&, &:hover": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor })
          .background,
        0.15
      ),
    },
  },
}));

interface NavbarLinkProps {
  icon: TablerIcon;
  label: string;
  to?: string;
}

const NavbarLink = ({ icon: Icon, label, to }: NavbarLinkProps) => {
  const { classes, cx } = useStyles();
  return (
    <Link to={to}>
      {({ isActive }) => (
        <Tooltip label={label} position="right">
          <UnstyledButton
            className={cx(classes.link, { [classes.active]: isActive })}
          >
            <Icon stroke={1.5} />
          </UnstyledButton>
        </Tooltip>
      )}
    </Link>
  );
};

interface NavbarButtonProps {
  icon: TablerIcon;
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const NavbarButton = ({ icon: Icon, label, onClick }: NavbarButtonProps) => {
  const { classes } = useStyles();
  return (
    <Tooltip label={label} position="right">
      <UnstyledButton className={classes.link} onClick={onClick}>
        <Icon stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
};

export const AppNavbar = () => {
  return (
    <Navbar
      width={{ base: 80 }}
      p="md"
      sx={(theme) => ({
        alignItems: "center",
        backgroundColor: theme.fn.variant({
          variant: "filled",
          color: theme.primaryColor,
        }).background,
      })}
    >
      <Navbar.Section grow>
        <Stack justify="center" spacing={4}>
          <NavbarLink icon={IconHome} label="Home" to="/" />
          <NavbarLink icon={IconDeviceGamepad2} label="Games" to="/games" />
          <NavbarLink icon={IconCategory} label="Paths" to="/paths" />
        </Stack>
      </Navbar.Section>
      <Navbar.Section>
        <Stack justify="center" spacing={4}>
          <NavbarLink icon={IconSettings} label="Settings" to="/settings" />
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
};
