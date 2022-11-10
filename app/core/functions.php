<?php

function show($x)
{
    echo '<pre>';
    print_r($x);
    echo '</pre>';
}

function buildMenuTree(array $elements, $parentId = 0)
{
    $branch = array();

    foreach ($elements as $element) {
        if ($element['parent_id'] == $parentId) {
            $children = buildMenuTree($elements, $element['id']);
            if ($children) {
                $element['children'] = $children;
            }
            $branch[] = $element;
        }
    }

    return $branch;
}

function redirect($view)
{
    header('Location:' . URL_ROOT . $view);
    die;
}

function in_array_r($needle, $haystack, $strict = false)
{
    foreach ($haystack as $item) {
        if (($strict ? $item === $needle : $item == $needle) || (is_array($item) && in_array_r($needle, $item, $strict))) {
            return true;
        }
    }

    return false;
}

function isMultiArray($arr)
{
    rsort($arr);
    foreach ($arr as $a) {
        if (!is_array($a)) {
            return false;
        }
    }
    return true;

    // rsort($arr);
    // return isset($arr[0]) && is_array($arr[0]);
}

function validateDate($date, $format = 'Y-m-d H:i:s')
{
    $d = DateTime::createFromFormat($format, $date);
    return $d && $d->format($format) == $date;
}
