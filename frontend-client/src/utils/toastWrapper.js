import { useToast } from 'vue-toastification';
import CustomToast from '@/components/CustomToast.vue';

const toast = useToast();

function formatArgs(args) {
  let temp = args;
  if (typeof temp === 'string') {
    temp = { content: temp };
  } else if (typeof temp === 'object') {
    temp = { ...temp };
  } else {
    temp = {};
  }
  return temp;
}

function getPosition(position) {
  if (position) {
    return {
      position,
    };
  }
  return {};
}

function success(args) {
  const props = formatArgs(args);
  toast.success({
    component: CustomToast,
    props,
  }, {
    toastClassName: 'toast-success',
    ...getPosition(props.position),
  });
}

function info(args) {
  const props = formatArgs(args);
  toast.info({
    component: CustomToast,
    props,
  }, {
    toastClassName: 'toast-info',
    ...getPosition(props.position),
  });
}

function error(args) {
  const props = formatArgs(args);
  toast.error({
    component: CustomToast,
    props,
  }, {
    toastClassName: 'toast-error',
    ...getPosition(props.position),
  });
}

export default {
  success,
  info,
  error,
};
