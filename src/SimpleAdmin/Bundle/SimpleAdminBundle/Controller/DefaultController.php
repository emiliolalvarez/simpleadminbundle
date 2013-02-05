<?php

namespace SimpleAdmin\Bundle\SimpleAdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends Controller
{
    public function indexAction($name)
    {
        return $this->render('SimpleAdminBundle:Default:index.html.twig', array('name' => $name));
    }

    public function defaultAction(Request $request){
        return new Response("Default controller",200);
    }
}